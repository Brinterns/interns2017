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

function powerUsed(position, userMoveId, opponentBool, user) {
    var room = user.getRoom();
    if (userMoveId === room.data.moveId) {
        room.data.moveId = shared.generateMoveId();
        switch(user.data.powerUp) {
            case "push":
                pushPiece(position, user, opponentBool);
                break;
            default:
                console.log("cannot use powerup");
                break;
        }
        user.message('updatemoveid', room.data.moveId);
    }
}

function pushPiece(position, user, opponentBool) {
    var room = user.getRoom();
    var opponent = shared.getOpponent(user);
    var nextPos = position + 1;

    if (!opponentBool) {
        var userStats = gamePlayFunctions.getUserStats(user);
        user.data.squares[playerPath[nextPos-1]] = true;
        gamePlayFunctions.handleMoveUserPiece(user, opponent, room, position, nextPos);
        //If the moved piece lands on an opponent piece, the opponent piece is sent back to starting position
        gamePlayFunctions.handleTakePiece(user, opponent, userStats, room, nextPos);
    } else {
        var userStats = gamePlayFunctions.getUserStats(opponent);
        opponent.data.squares[playerPath[nextPos-1]] = true;
        gamePlayFunctions.handleMoveUserPiece(opponent, user, room, position, nextPos);
        //If the moved piece lands on an opponent piece, the opponent piece is sent back to starting position
        gamePlayFunctions.handleTakePiece(opponent, user, userStats, room, nextPos);
    }

    //If moved piece lands on power up, remove the powerup
    if (room.data.powerUps.includes(playerPath[nextPos-1])) {
        room.data.powerUps = room.data.powerUps.filter((powerUpIndex) => {
            return powerUpIndex !== playerPath[nextPos-1];
        });
        room.messageMembers('updatepowerups', JSON.stringify(room.data.powerUps));
    }

    user.data.powerUp = null;
    user.message('newpowerup', user.data.powerUp);
    user.message('powerpieces', []);
}




module.exports.powerupActivated = powerupActivated;
module.exports.powerUsed = powerUsed;
