var cloak = require('cloak');
var gamePlayFunctions = require('./cloak-server-gameplay');
var shared = require('./cloak-server-shared');

function powerupActivated(user, powerUp) {
    const room = user.getRoom();
    const playerPath = room.data.playerPath;
    const opponentPath = room.data.opponentPath;
    switch (powerUp) {
        case "push":
            pushActivated(user, playerPath, opponentPath);
            break;
        case "pull":
            pullActivated(user, playerPath, opponentPath);
            break;
        case "shield":
            shieldBootActivated(user, playerPath);
            break;
        case "boot":
            shieldBootActivated(user, playerPath);
            break;
        case "remoteattack":
            remoteAttackActivated(user, opponentPath);
            break;
        case "swap":
            swapActivated(user, playerPath);
            break;
        case "ghost":
            ghostActivated(user);
            break;
        case "reroll":
            reRoll(user);
            break;
        default:
            console.log("Power up not found");
            break;
    }
}

function pushActivated(user, playerPath, opponentPath) {
    var pushablePieces = [];
    var opponent = shared.getOpponent(user);
    user.data.piecePositions.forEach((position) => {
        if (gamePlayFunctions.canMove(user, opponent.data.squares, position + 1, [], position)) {
            pushablePieces.push(playerPath[position-1]);
        }
    });
    opponent.data.piecePositions.forEach((position) => {
        if (gamePlayFunctions.canMove(opponent, user.data.squares, position + 1, [], position)) {
            pushablePieces.push(opponentPath[position-1]);
        }
    });
    user.message('powerpieces', pushablePieces);
}

function pullActivated(user, playerPath, opponentPath) {
    var pullablePieces = [];
    var opponent = shared.getOpponent(user);
    const finalPosition = user.getRoom().data.finalPosition;
    user.data.piecePositions.forEach((position) => {
        if ((position > 0) && (position < finalPosition) && ((position === 1) || gamePlayFunctions.canMove(user, opponent.data.squares, position - 1, [], position))) {
            pullablePieces.push(playerPath[position-1]);
        }
    });
    opponent.data.piecePositions.forEach((position) => {
        if ((position > 0) && (position < finalPosition) && ((position === 1) || gamePlayFunctions.canMove(opponent, user.data.squares, position - 1, [], position))) {
            pullablePieces.push(opponentPath[position-1]);
        }
    });
    user.message('powerpieces', pullablePieces);
}

function shieldBootActivated(user, playerPath) {
    var activePieces = [];
    const finalPosition = user.getRoom().data.finalPosition;
    user.data.piecePositions.forEach((position) => {
        if ((position > 0) && (position < finalPosition)) {
            activePieces.push(playerPath[position-1]);
        }
    });
    user.message('powerpieces', activePieces);
}

function remoteAttackActivated(user, opponentPath) {
    var remoteAttackablePieces = [];
    var opponent = shared.getOpponent(user);
    const finalPosition = user.getRoom().data.finalPosition;
    opponent.data.piecePositions.forEach((position) => {
        if ((position > 0) && (position < finalPosition)) {
            remoteAttackablePieces.push(opponentPath[position-1]);
        }
    });
    user.message('powerpieces', remoteAttackablePieces);
}

function swapActivated(user, playerPath) {
    var swapablePieces = [];
    const warZoneEnd = user.getRoom().data.warZoneEnd;
    user.data.piecePositions.forEach((position) => {
        if ((position > 4) && (position < warZoneEnd)) {
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
        gamePlayFunctions.getUserStats(user).powerUpsUsed ++;
        switch(powerUp) {
            case "push":
                pushPullPiece(position, user, opponent, opponentBool);
                break;
            case "pull":
                pushPullPiece(position, user, opponent, opponentBool);
                break;
            case "shield":
                shieldBootPiece(position, user, opponent, "shield");
                break;
            case "remoteattack":
                remoteAttackPiece(position, user, opponent);
                break;
            case "swap":
                swapPiece(position, user, opponent, opponentBool);
                break;
            case "boot":
                shieldBootPiece(position, user, opponent, "boot");
                break;
            default:
                gamePlayFunctions.getUserStats(user).powerUpsUsed --;
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
            user.data.squares[room.data.playerPath[nextPos-1]] = true;
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
            opponent.data.squares[room.data.playerPath[nextPos-1]] = true;
            gamePlayFunctions.handleMoveUserPiece(opponent, user, room, position, nextPos, false);
            //If the moved piece lands on an opponent piece, the opponent piece is sent back to starting position
            gamePlayFunctions.handleTakePiece(opponent, user, userStats, room, nextPos);
        }
    }
    //If moved piece lands on power up, remove the powerup
    if (room.data.powerUps.includes(room.data.playerPath[nextPos-1])) {
        room.data.powerUps = room.data.powerUps.filter((powerUpIndex) => {
            return powerUpIndex !== room.data.playerPath[nextPos-1];
        });
        room.messageMembers('updatepowerups', JSON.stringify(room.data.powerUps));
    }
    clearPowerUp(user);
}

function getActivePowerUps(user, opponent) {
    const opponentPath = user.getRoom().data.opponentPath;
    var activePowerUps = Object.assign([], user.data.piecePowerUps);
    opponent.data.piecePowerUps.forEach((piecePowerUp) => {
        var copy = Object.assign({}, piecePowerUp);
        copy.squareIndex = opponentPath[piecePowerUp.position - 1];
        activePowerUps.push(copy);
    });
    return activePowerUps;
}

function messageActivePowerUps(user, opponent) {
    const room = user.getRoom();
    const activePowerUps = getActivePowerUps(user, opponent);
    user.message('activepowerups', activePowerUps);
    if (user.id === room.data.spectatedId) {
        shared.getSpectators(room).forEach((spectator) => {
            spectator.message('activepowerups', activePowerUps);
        });
    }
}

function shieldBootPiece(position, user, opponent, type) {
    const index = user.data.piecePositions.indexOf(position);
    const playerPath = user.getRoom().data.playerPath;
    if (user.data.piecePowerUps[index].powerUp && (user.data.piecePowerUps[index].powerUp !== type)) {
        user.data.piecePowerUps[index] = {powerUp: null, turnsLeft: null, squareIndex: playerPath[position-1], position: position};
        messageActivePowerUps(user, opponent);
        messageActivePowerUps(opponent, user);
    }
    user.data.piecePowerUps[index] = {powerUp: type, turnsLeft: 3, squareIndex: playerPath[position-1], position: position};
    messageActivePowerUps(user, opponent);
    messageActivePowerUps(opponent, user);
    clearPowerUp(user);
}

function remoteAttackPiece(position, user, opponent) {
    const index = opponent.data.piecePositions.indexOf(position);
    const currentPowerUp = opponent.data.piecePowerUps[index].powerUp;
    opponent.data.piecePowerUps[index].powerUp = null;
    opponent.data.piecePowerUps[index].turnsLeft = null;
    messageActivePowerUps(user, opponent);
    messageActivePowerUps(opponent, user);
    if (currentPowerUp !== "shield") {
        opponent.data.piecePositions[index] = 0;
        const reverseSquares = gamePlayFunctions.reverseSquares(opponent);
        const room = user.getRoom();
        opponent.data.squares[room.data.playerPath[position-1]] = false;
        opponent.message('piecepositions', opponent.data.piecePositions);
        opponent.message('squares', opponent.data.squares);
        user.message('opponentsquares', reverseSquares);
        shared.getSpectators(room).forEach(function(spectator) {
            if (user.id === room.data.spectatedId) {
                spectator.message('opponentsquares', reverseSquares);
            } else {
                spectator.message('piecepositions', opponent);
                spectator.message('squares', opponent.data.squares);
            }
        });
    }
    clearPowerUp(user);
}

function swapPiece(position, user, opponent, opponentBool) {
    const room = user.getRoom();
    const playerPath = room.data.playerPath;
    if (!opponentBool) {
        user.data.swapPos = position;
        var opponentSwapablePieces = [];
        const warZoneEnd = room.data.warZoneEnd;
        opponent.data.piecePositions.forEach((position) => {
            if ((position > 4) && (position < warZoneEnd)) {
                position = shared.translatePosition(room, position);
                opponentSwapablePieces.push(playerPath[position-1]);
            }
        });
        gamePlayFunctions.getUserStats(user).powerUpsUsed --;
        user.message('powerpieces', opponentSwapablePieces);
    } else {
        //Index of user piece in piece positions array
        var userT = shared.translatePosition(room, user.data.swapPos);
        var positionT = shared.translatePosition(room, position);

        updatePieces(user, user.data.piecePositions.indexOf(user.data.swapPos), user.data.swapPos, positionT, playerPath);
        updatePieces(opponent, opponent.data.piecePositions.indexOf(position), position, userT, playerPath);
        user.data.swapPos = null;
        messageActivePowerUps(user, opponent);
        messageActivePowerUps(opponent, user);
        updatePiecesMessages(user, gamePlayFunctions.reverseSquares(opponent));
        updatePiecesMessages(opponent, gamePlayFunctions.reverseSquares(user));
        clearPowerUp(user);
    }
}

function ghostActivated(user) {
    var opponent = shared.getOpponent(user);
    opponent.data.ghostTurns = 3;
    opponent.message('opponentsquares', Array(24).fill(false));
    opponent.message('opponentghost', opponent.data.ghostTurns);
    user.message('ghost', opponent.data.ghostTurns);
    user.getRoom().messageMembers('powernotify', user.data.powerUp);
    clearPowerUp(user);
}

function reRoll(user) {
    const room = user.getRoom();
    room.messageMembers('currentplayer', room.data.currentPlayer);
    user.data.rolledDice = false;
    room.messageMembers('powernotify', user.data.powerUp);
    gamePlayFunctions.getUserStats(user).powerUpsUsed ++;
    clearPowerUp(user);
}

function updatePieces(user, index, oldPos, newPos, playerPath) {
    user.data.piecePositions[index] = newPos;
    user.data.piecePowerUps[index].position = newPos;
    user.data.piecePowerUps[index].squareIndex = playerPath[newPos-1];
    user.data.squares[playerPath[oldPos-1]] = false;
    user.data.squares[playerPath[newPos-1]] = true;
}

function updatePiecesMessages(user, reverseSquares) {
    const room = user.getRoom();
    user.message('piecepositions', user.data.piecePositions);
    user.message('squares', user.data.squares);
    user.message('opponentsquares', reverseSquares);
    shared.getSpectators(room).forEach(function(spectator) {
        if (user.id === room.data.spectatedId) {
            spectator.message('piecepositions', user.data.piecePositions);
            spectator.message('squares', user.data.squares);
            spectator.message('opponentsquares', reverseSquares);
        }
    });
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
module.exports.updatePiecesMessages = updatePiecesMessages;
module.exports.reRoll = reRoll;
