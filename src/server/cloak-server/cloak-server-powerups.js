var cloak = require('cloak');
var gamePlayFunctions = require('./cloak-server-gameplay');
var shared = require('./cloak-server-shared');

const playerPath = [
    14, 17, 20, 23,
    22, 19, 16, 13,
    10, 7,  4,  1,
    2,  5,  8
];
const opponentPath = [
    12, 15, 18, 21,
    22, 19, 16, 13,
    10, 7,  4,  1,
    0, 3,   6
];

function powerupActivated(user, powerUp) {
    switch (powerUp) {
        case "push":
            pushActivated(user);
            break;
        case "shield":
            shieldActivated(user);
            break;
        default:
            console.log("Power up not found");
            break;
    }
}

function pushActivated(user) {
    var pushablePieces = [];
    var opponent = shared.getOpponent(user);
    user.data.piecePositions.forEach((position) => {
        if ((position > 0) && gamePlayFunctions.canMove(user.data.squares, opponent.data.squares, position + 1, [], position)) {
            pushablePieces.push(playerPath[position-1]);
        }
    });
    opponent.data.piecePositions.forEach((position) => {
        if ((position > 0) && gamePlayFunctions.canMove(opponent.data.squares, user.data.squares, position + 1, [], position)) {
            pushablePieces.push(opponentPath[position-1]);
        }
    });
    user.message('powerpieces', pushablePieces);
}

function shieldActivated(user) {
    var shieldablePieces = [];
    user.data.piecePositions.forEach((position) => {
        if ((position > 0) && (position < 15)) {
            shieldablePieces.push(playerPath[position-1]);
        }
    });
    user.message('powerpieces', shieldablePieces);
}

function powerUsed(position, userMoveId, opponentBool, user) {
    var room = user.getRoom();
    if (userMoveId === room.data.moveId) {
        room.data.moveId = shared.generateMoveId();
        var powerUp = user.data.powerUp;
        switch(user.data.powerUp) {
            case "push":
                pushPiece(position, user, opponentBool);
                break;
            case "shield":
                shieldPiece(position, user);
                break;
            default:
                console.log("cannot use powerup");
                break;
        }
        user.message('updatemoveid', room.data.moveId);
        room.messageMembers('powernotify', powerUp);
    }
    gamePlayFunctions.sendStats(user);
}

function pushPiece(position, user, opponentBool) {
    var room = user.getRoom();
    var opponent = shared.getOpponent(user);
    var nextPos = position + 1;
    if (!opponentBool) {
        const oppIndex = opponent.data.piecePositions.indexOf(nextPos);
        if ((oppIndex !== -1) && opponent.data.piecePowerUps[oppIndex].powerUp === "shield") {
            gamePlayFunctions.handleMoveUserPiece(user, opponent, room, position, nextPos, true);
        } else {
            var userStats = gamePlayFunctions.getUserStats(user);
            user.data.squares[playerPath[nextPos-1]] = true;
            gamePlayFunctions.handleMoveUserPiece(user, opponent, room, position, nextPos, false);
            //If the moved piece lands on an opponent piece, the opponent piece is sent back to starting position
            gamePlayFunctions.handleTakePiece(user, opponent, userStats, room, nextPos);
        }
    } else {
        const oppIndex = user.data.piecePositions.indexOf(nextPos);
        if ((oppIndex !== -1) && user.data.piecePowerUps[oppIndex].powerUp === "shield") {
            gamePlayFunctions.handleMoveUserPiece(opponent, user, room, position, nextPos, true);
        } else {
            var userStats = gamePlayFunctions.getUserStats(opponent);
            opponent.data.squares[playerPath[nextPos-1]] = true;
            gamePlayFunctions.handleMoveUserPiece(opponent, user, room, position, nextPos, false);
            //If the moved piece lands on an opponent piece, the opponent piece is sent back to starting position
            gamePlayFunctions.handleTakePiece(opponent, user, userStats, room, nextPos);
        }
    }
    //If moved piece lands on power up, remove the powerup
    if (room.data.powerUps.includes(playerPath[nextPos-1])) {
        room.data.powerUps = room.data.powerUps.filter((powerUpIndex) => {
            return powerUpIndex !== playerPath[nextPos-1];
        });
        room.messageMembers('updatepowerups', JSON.stringify(room.data.powerUps));
    }
    clearPowerUp(user);
}

function messageActivePowerUps(user, opponent) {
    var activePowerUps = Object.assign([], user.data.piecePowerUps);
    opponent.data.piecePowerUps.forEach((piecePowerUp) => {
        var copy = Object.assign({}, piecePowerUp);
        copy.squareIndex = opponentPath[piecePowerUp.position - 1];
        activePowerUps.push(copy);
    });
    user.message('activepowerups', activePowerUps);
}

function shieldPiece(position, user) {
    const index = user.data.piecePositions.indexOf(position);
    user.data.piecePowerUps[index] = {powerUp: "shield", turnsLeft: 3, squareIndex: playerPath[position-1], position: position};
    const opponent = shared.getOpponent(user);
    messageActivePowerUps(user, opponent);
    messageActivePowerUps(opponent, user);
    clearPowerUp(user);
}

function clearPowerUp(user) {
    user.data.powerUp = null;
    user.message('newpowerup', user.data.powerUp);
    user.message('powerpieces', []);
}

module.exports.powerupActivated = powerupActivated;
module.exports.powerUsed = powerUsed;
module.exports.messageActivePowerUps = messageActivePowerUps;
