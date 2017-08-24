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
        case "pull":
            pullActivated(user);
            break;
        case "shield":
            shieldActivated(user);
            break;
        case "remoteattack":
            remoteAttackActivated(user);
            break;
        case "swap":
            swapActivated(user);
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
        if (gamePlayFunctions.canMove(user.data.squares, opponent.data.squares, position + 1, [], position)) {
            pushablePieces.push(playerPath[position-1]);
        }
    });
    opponent.data.piecePositions.forEach((position) => {
        if (gamePlayFunctions.canMove(opponent.data.squares, user.data.squares, position + 1, [], position)) {
            pushablePieces.push(opponentPath[position-1]);
        }
    });
    user.message('powerpieces', pushablePieces);
}

function pullActivated(user) {
    var pullablePieces = [];
    var opponent = shared.getOpponent(user);
    user.data.piecePositions.forEach((position) => {
        if ((position > 0) && (position < 15) && ((position === 1) || gamePlayFunctions.canMove(user.data.squares, opponent.data.squares, position - 1, [], position - 2))) {
            pullablePieces.push(playerPath[position-1]);
        }
    });
    opponent.data.piecePositions.forEach((position) => {
        if ((position > 0) && (position < 15) && ((position === 1) || gamePlayFunctions.canMove(opponent.data.squares, user.data.squares, position - 1, [], position - 2))) {
            pullablePieces.push(opponentPath[position-1]);
        }
    });
    user.message('powerpieces', pullablePieces);
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

function remoteAttackActivated(user) {
    var remoteAttackablePieces = [];
    var opponent = shared.getOpponent(user);
    opponent.data.piecePositions.forEach((position) => {
        if ((position > 0) && (position < 15)) {
            remoteAttackablePieces.push(opponentPath[position-1]);
        }
    });
    user.message('powerpieces', remoteAttackablePieces);
}

function swapActivated(user) {
    var swapablePieces = [];
    user.data.piecePositions.forEach((position) => {
        if ((position > 4) && (position < 13)) {
            swapablePieces.push(playerPath[position-1]);
        }
    });
    user.message('powerpieces', swapablePieces);
}

function powerUsed(position, userMoveId, opponentBool, user) {
    var room = user.getRoom();
    if (userMoveId === room.data.moveId) {
        room.data.moveId = shared.generateMoveId();
        var powerUp = user.data.powerUp;
        var opponent = shared.getOpponent(user);
        switch(powerUp) {
            case "push":
                pushPullPiece(position, user, opponent, opponentBool);
                break;
            case "pull":
                pushPullPiece(position, user, opponent, opponentBool);
                break;
            case "shield":
                shieldPiece(position, user, opponent);
                break;
            case "remoteattack":
                remoteAttackPiece(position, user, opponent);
                break;
            case "swap":
                swapPiece(position, user, opponent);
                break;
            default:
                console.log("cannot use powerup");
                break;
        }
        user.message('updatemoveid', room.data.moveId);
        if ((powerUp !== "swap") || (opponent.data.piecePositions.indexOf(position)) >= 0) {
            room.messageMembers('powernotify', powerUp);
        }
    }
    gamePlayFunctions.sendStats(user);
}

function pushPullPiece(position, user, opponent, opponentBool) {
    var room = user.getRoom();
    var nextPos = (user.data.powerUp === "push") ? position + 1 : position - 1;
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

function getActivePowerUps(user, opponent) {
    var activePowerUps = Object.assign([], user.data.piecePowerUps);
    opponent.data.piecePowerUps.forEach((piecePowerUp) => {
        var copy = Object.assign({}, piecePowerUp);
        copy.squareIndex = opponentPath[piecePowerUp.position - 1];
        activePowerUps.push(copy);
    });
    return activePowerUps;
}

function messageActivePowerUps(user, opponent) {
    const activePowerUps = getActivePowerUps(user, opponent);
    user.message('activepowerups', activePowerUps);
    const room = user.getRoom();
    if (user.id === room.data.spectatedId) {
        shared.getSpectators(room).forEach((spectator) => {
            spectator.message('activepowerups', activePowerUps);
        });
    }
}

function shieldPiece(position, user, opponent) {
    const index = user.data.piecePositions.indexOf(position);
    user.data.piecePowerUps[index] = {powerUp: "shield", turnsLeft: 3, squareIndex: playerPath[position-1], position: position};
    messageActivePowerUps(user, opponent);
    messageActivePowerUps(opponent, user);
    clearPowerUp(user);
}

function remoteAttackPiece(position, user, opponent) {
    const index = opponent.data.piecePositions.indexOf(position);
    const currentPowerUp = opponent.data.piecePowerUps[index].powerUp;
    opponent.data.piecePowerUps[index].powerUp = null;
    opponent.data.piecePowerUps[index].turnsLeft = null;
    if (currentPowerUp === "shield") {
        messageActivePowerUps(user, opponent);
        messageActivePowerUps(opponent, user);
    } else {
        opponent.data.piecePositions[index] = 0;
        const reverseSquares = gamePlayFunctions.reverseSquares(opponent.data.piecePositions);
        const room = user.getRoom();
        opponent.data.squares[playerPath[position-1]] = false;
        opponent.message('piecepositions', opponent.data.piecePositions);
        opponent.message('squares', opponent.data.squares);
        user.message('opponentsquares', reverseSquares);
        shared.getSpectators(room).forEach(function(spectator) {
            if (user.id === room.data.spectatedId) {
                spectator.message('opponentsquares', reverseSquares);
            } else {
                spectator.message('piecepositions', opponent.data.piecePositions);
                spectator.message('squares', opponent.data.squares);
            }
        });
    }
    clearPowerUp(user);
}

function swapPiece(position, user, opponent) {
    if (user.data.piecePositions.indexOf(position) >= 0) {
        user.data.swapPos = position;
        var opponentSwapablePieces = [];
        opponent.data.piecePositions.forEach((position) => {
            if ((position > 4) && (position < 13)) {
                opponentSwapablePieces.push(playerPath[position-1]);
            }
        });
        user.message('powerpieces', opponentSwapablePieces);
    } else {
        const room = user.getRoom();
        //Index of user piece in piece positions array
        const index = user.data.piecePositions.indexOf(user.data.swapPos);
        const oppIndex = opponent.data.piecePositions.indexOf(position);
        user.data.piecePositions[index] = position;
        user.data.piecePowerUps[index].position = position;
        user.data.piecePowerUps[index].squareIndex = playerPath[position-1];
        user.data.squares[playerPath[user.data.swapPos-1]] = false;
        user.data.squares[playerPath[position-1]] = true;
        opponent.data.piecePositions[oppIndex] = user.data.swapPos;
        opponent.data.piecePowerUps[oppIndex].position = user.data.swapPos;
        opponent.data.piecePowerUps[oppIndex].squareIndex = playerPath[user.data.swapPos-1];
        opponent.data.squares[playerPath[position-1]] = false;
        opponent.data.squares[playerPath[user.data.swapPos-1]] = true;
        user.data.swapPos = null;

        const reverseSquares = gamePlayFunctions.reverseSquares(opponent.data.piecePositions);
        const oppReverseSquares = gamePlayFunctions.reverseSquares(user.data.piecePositions);
        messageActivePowerUps(user, opponent);
        messageActivePowerUps(opponent, user);
        user.message('piecepositions', user.data.piecePositions);
        opponent.message('piecepositions', opponent.data.piecePositions);
        user.message('squares', user.data.squares);
        opponent.message('squares', opponent.data.squares);
        user.message('opponentsquares', reverseSquares);
        opponent.message('opponentsquares', oppReverseSquares);
        shared.getSpectators(room).forEach(function(spectator) {
            if (user.id === room.data.spectatedId) {
                spectator.message('piecepositions', user.data.piecePositions);
                spectator.message('squares', user.data.squares);
                spectator.message('opponentsquares', reverseSquares);
            } else {
                spectator.message('piecepositions', opponent.data.piecePositions);
                spectator.message('squares', opponent.data.squares);
                spectator.message('opponentsquare', oppReverseSquares);
            }
        });
        clearPowerUp(user);
    }
}

function clearPowerUp(user) {
    user.data.powerUp = null;
    user.message('newpowerup', user.data.powerUp);
    user.message('powerpieces', []);
}

module.exports.powerupActivated = powerupActivated;
module.exports.powerUsed = powerUsed;
module.exports.getActivePowerUps = getActivePowerUps;
module.exports.messageActivePowerUps = messageActivePowerUps;
