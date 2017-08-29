var cloak = require('cloak');
var shared = require('./cloak-server-shared');
var gameRoomFunctions = require('./cloak-server-gameroom');
var powerUpFunctions = require('./cloak-server-powerups');
var gamePlayFunctions = require('./cloak-server-gameplay');

//Game playing variables
const rosettaSquares = [3,5,13,21,23];
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

const powerUpTypes = ['push', 'shield', 'pull', 'reroll', 'swap', 'boot', 'remoteattack'];
const powerUpProbs = [17, 34, 51, 68, 85, 93, 100];

function rollDice(user) {
    var total = 0;
    for (var i = 0; i < 4; i ++) {
        total += shared.getRandomIntInclusive(0,1);
    }
    getUserStats(user).numberOfRolls ++;
    return total;
}

function messageRoll(total, user) {
    user.message('rolledvalue', total);
    setTimeout(() => {
        shared.getOpponent(user).message('opponentroll', total);
        shared.getSpectators(user.getRoom()).forEach(function(spectator) {
            spectator.message('opponentroll', total);
        });
    }, 175);
    user.data.lastRoll = total;
}

function endTurn(user) {
    user.data.rolledDice = false;
    const room = user.getRoom();
    var opponent = shared.getOpponent(user);
    if (room.data.enablePowerUps) {
        randomPowerUp(room, user, opponent);
    }
    room.data.currentPlayer = opponent.id;
    const numPiecesEndRange = user.data.piecePositions.filter((position) => {
        return (position >= 11 && position <= 14);
    }).length;
    getUserStats(user).turnsInEndRange += numPiecesEndRange;
    if ((user.data.numPiecesFinished === (room.data.numberOfPieces - 1)) && (numPiecesEndRange === 1)) {
        getUserStats(user).turnsLastInEndRange ++;
    }
    room.messageMembers('currentplayer', room.data.currentPlayer);
    sendStats(user);
    var d = new Date();
    opponent.data.rollStartTime = d.getTime();
    opponent.message('updatemoveid', room.data.moveId);

    opponent.data.piecePowerUps.forEach((piecePowerUp) => {
        if (piecePowerUp.turnsLeft === 1 || !piecePowerUp.turnsLeft) {
            piecePowerUp.powerUp = null;
            piecePowerUp.turnsLeft = null;
        } else {
            piecePowerUp.turnsLeft --;
        }
    });
    powerUpFunctions.messageActivePowerUps(user, opponent);
    powerUpFunctions.messageActivePowerUps(opponent, user);
}

function canMove(user, opponentSquares, nextPos, moveablePositions, position) {
    if (nextPos <= 15) {
        const index = user.data.piecePositions.indexOf(position);
        if ((!((nextPos === 8) && opponentSquares[opponentPath[nextPos-1]]) && !user.data.squares[playerPath[nextPos-1]]) || (user.data.piecePowerUps[index].powerUp === "boot") || (nextPos === 15)) {
            moveablePositions.push(position);
            return true;
        }
    }
    return false;
}

function checkMoves(user, rollNumber, opponentSquares) {
    var moveablePositions = [];
    const moveablePieces = user.data.piecePositions.filter((position) => {
        return (position >= 0) && canMove(user, opponentSquares, position + rollNumber, moveablePositions, position);
    });
    if (moveablePieces.length === 0) {
        if (user.data.powerUp === "reroll") {
            powerUpFunctions.reRoll(user);
            user.message('autoreroll');
        } else {
            endTurn(user);
        }
    }
    user.message('moveablepositions', moveablePositions);
}

function movePiece(position, userMoveId, user) {
    var room = user.getRoom();
    if (userMoveId === room.data.moveId) {
        room.data.moveId = shared.generateMoveId();
        var opponent = shared.getOpponent(user);
        var nextPos = position + user.data.lastRoll;
        var userStats = getUserStats(user);
        var d = new Date();
        userStats.totalTimeTaken += milliToSeconds(d.getTime() - user.data.rollStartTime - 1650);

        const oppIndex = opponent.data.piecePositions.indexOf(nextPos);
        if ((oppIndex !== -1) && (nextPos > 4) && (nextPos < 15) && opponent.data.piecePowerUps[oppIndex].powerUp === "shield") {
            handleMoveUserPiece(user, opponent, room, position, nextPos, true);
        } else {
            const pieceIndex = user.data.piecePositions.indexOf(position);
            user.data.squares[playerPath[nextPos-1]] = true;
            userStats.squaresMoved += user.data.lastRoll;
            //If piece to move has boot powerup, deal with pieces that the piece passes during the move
            if ((position < 15) && (user.data.lastRoll > 1) && user.data.piecePowerUps[pieceIndex].powerUp === "boot") {
                handleBootMove(user, opponent, position+1, nextPos);
            } else {
                //If the moved piece lands on an opponent piece, the opponent piece is sent back to starting position
                handleTakePiece(user, opponent, userStats, room, nextPos);
            }
            user.data.squares[playerPath[nextPos-1]] = true;
            handleMoveUserPiece(user, opponent, room, position, nextPos, false);
            //If moved piece lands on power up, obtain the powerup
            handlePowerupTake(user, room, nextPos);
            //if moved piece lands on rosetta square, allow reroll and reset roll timer
            if (handleRosetta(user, room, position, d)) {
                return;
            }
        }
        //balances out the increment for this piece being in the final range as it has just moved there
        handleFinalRange(user, userStats, room, position, nextPos);
        userStats.turnsTaken ++;
        endTurn(user);
    }
}

function handleMoveUserPiece(user, opponent, room, position, nextPos, shielded) {
    if (!shielded && (position !== 0)) {
        user.data.squares[playerPath[position-1]] = false;
    }
    if (nextPos === 15) {
        user.data.numPiecesFinished ++;
        user.message('finishedpieces', user.data.numPiecesFinished);
        opponent.message('finishedopppieces', user.data.numPiecesFinished);
        shared.getSpectators(room).forEach(function(spectator) {
            if (user.id === room.data.spectatedId) {
                spectator.message('finishedpieces', user.data.numPiecesFinished);
            } else {
                spectator.message('finishedopppieces', user.data.numPiecesFinished);
            }
        });
        if (user.data.numPiecesFinished === room.data.numberOfPieces) {
            gameRoomFunctions.win(true, user);
        }
    }
    if (shielded) {
        const index = opponent.data.piecePositions.indexOf(nextPos);
        opponent.data.piecePowerUps[index].powerUp = null;
        opponent.data.piecePowerUps[index].turnsLeft = null;
    } else {
        const index = user.data.piecePositions.indexOf(position);
        user.data.piecePositions[index] = nextPos;
        user.data.piecePowerUps[index].position = nextPos;
        user.data.piecePowerUps[index].squareIndex = playerPath[nextPos-1];
    }
    powerUpFunctions.messageActivePowerUps(user, opponent);
    powerUpFunctions.messageActivePowerUps(opponent, user);
    user.message('piecepositions', user.data.piecePositions);
    user.message('squares', user.data.squares);
    opponent.message('opponentsquares', reverseSquares(user.data.piecePositions));
    shared.getSpectators(room).forEach(function(spectator) {
        if (user.id === room.data.spectatedId) {
            spectator.message('piecepositions', user.data.piecePositions);
            spectator.message('squares', user.data.squares);
        } else {
            spectator.message('opponentsquares', reverseSquares(user.data.piecePositions));
        }
    });
}

function handleTakePiece(user, opponent, userStats, room, nextPos) {
    if ((nextPos > 4) && (nextPos < 13) && opponent.data.piecePositions.includes(nextPos)) {
        const oppIndex = opponent.data.piecePositions.indexOf(nextPos);
        opponent.data.piecePositions[oppIndex] = 0;
        opponent.data.piecePowerUps[oppIndex].powerUp = null;
        opponent.data.piecePowerUps[oppIndex].turnsLeft = null;
        opponent.data.squares[playerPath[nextPos-1]] = false;
        opponent.message('piecepositions', opponent.data.piecePositions);
        opponent.message('squares', opponent.data.squares);
        user.message('opponentsquares', reverseSquares(opponent.data.piecePositions));
        shared.getSpectators(room).forEach(function(spectator) {
            if (user.id === room.data.spectatedId) {
                spectator.message('opponentsquares', reverseSquares(opponent.data.piecePositions));
            } else {
                spectator.message('piecepositions', opponent.data.piecePositions);
                spectator.message('squares', opponent.data.squares);
            }
        });
        userStats.piecesTaken ++;
        getUserStats(opponent).piecesLost ++;
    }
}

function handleRosetta(user, room, position, d) {
    if (rosettaSquares.includes(playerPath[position+user.data.lastRoll-1])) {
        room.messageMembers('currentplayer', room.data.currentPlayer);
        user.message('updatemoveid', room.data.moveId);
        user.data.rolledDice = false;
        user.data.rollStartTime = d.getTime();
        return true;
    }
    return false;
}

function handlePowerupTake(user, room, nextPos) {
    if (room.data.powerUps.includes(playerPath[nextPos-1])) {
        room.data.powerUps = room.data.powerUps.filter((powerUpIndex) => {
            return powerUpIndex !== playerPath[nextPos-1];
        });
        room.messageMembers('updatepowerups', JSON.stringify(room.data.powerUps));
        const randomNumber = shared.getRandomIntInclusive(1, 100);
        for (var i = 0; i < powerUpProbs.length; i ++) {
            if (randomNumber <= powerUpProbs[i]) {
                user.data.powerUp = powerUpTypes[i];
                break;
            }
        }
        getUserStats(user).powerUpsCollected ++;
        user.message('newpowerup', user.data.powerUp);
    }
}

function handleBootHit(player, position, isUser, opponent) {
    //cannot jump over an opponent piece in their safe zone
    if (!isUser && (position >= 13 || position <= 4)) {
        return;
    }
    const index = player.data.piecePositions.indexOf(position);
    if (index > -1) {
        if (player.data.piecePowerUps[index].powerUp === "shield") {
            player.data.piecePowerUps[index].powerUp = null;
            player.data.piecePowerUps[index].turnsLeft = null;
        } else {
            player.data.piecePositions[index] = 0;
            player.data.squares[playerPath[position-1]] = false;
            player.data.piecePowerUps[index].powerUp = null;
            player.data.piecePowerUps[index].turnsLeft = null;
            getUserStats(player).piecesLost ++;
            //If the player losing a piece is not the user with boots, increment the piece taken state for
            //use with the boots
            if (!isUser) {
                getUserStats(opponent).piecesTaken ++;
            }
        }
    }
}

function handleBootMove(user, opponent, first, final) {
    for (var i = first; i <= final; i ++) {
        handleBootHit(user, i, true, opponent);
        handleBootHit(opponent, i, false, user);
    }
    powerUpFunctions.updatePiecesMessages(user, gamePlayFunctions.reverseSquares(opponent.data.piecePositions));
    powerUpFunctions.updatePiecesMessages(opponent, gamePlayFunctions.reverseSquares(user.data.piecePositions));
}

function handleFinalRange(user, userStats, room, position, nextPos) {
    if ((nextPos >= 11 && nextPos <= 14) && (!(position >= 11 && position <= 14))) {
        if (user.data.numPiecesFinished === (room.data.numberOfPieces - 1)) {
            userStats.turnsLastInEndRange --;
        }
        userStats.turnsInEndRange --;
    }
}

function reverseSquares(positions) {
    var reverse = Array(24).fill(false);
    positions.forEach(position => {
        if (position > 0) {
            reverse[opponentPath[position-1]] = true;
        }
    });
    return reverse;
}

function getUserStats(user) {
    let room = user.getRoom();
    return userStats = room.data.gameinfo.players[room.data.gameinfo.playerIds.indexOf(user.id)];
}

function milliToSeconds(millis) {
    const seconds = Math.floor(millis / 1000);
    return seconds;
}

function sendStats(user) {
    const room = user.getRoom();
    room.messageMembers('updatestats', JSON.stringify(room.data.gameinfo));
}

function randomPowerUp(room, user, opponent) {
    const randomNum = shared.getRandomIntInclusive(0,6);
    if (randomNum < 5 || room.data.powerUps.length >= 2) {
        return;
    }
    //only look to random powerups in war zone
    var freeSquares = [];
    for (var i = 4; i <= 11; i++) {
        //if there are no powerups on a space and no player pieces then add the square index as free
        if (!room.data.powerUps.includes(playerPath[i])){
            if (!user.data.squares[playerPath[i]] && !opponent.data.squares[playerPath[i]]) {
                freeSquares.push(playerPath[i]);
            }
        }
    }
    if (freeSquares.length === 0) {
        return;
    }
    //random which square index will have the powerup from all the free squares
    //random which powerup to place on the square
    const powerUpIndex = freeSquares[shared.getRandomIntInclusive(0,freeSquares.length-1)];
    room.data.powerUps.push(powerUpIndex);
    room.messageMembers('updatepowerups', JSON.stringify(room.data.powerUps));
}


module.exports.endTurn = endTurn;
module.exports.rollDice = rollDice;
module.exports.messageRoll = messageRoll;
module.exports.movePiece = movePiece;
module.exports.canMove = canMove;
module.exports.reverseSquares = reverseSquares;
module.exports.handleMoveUserPiece = handleMoveUserPiece;
module.exports.handleTakePiece = handleTakePiece;
module.exports.checkMoves = checkMoves;
module.exports.sendStats = sendStats;
module.exports.getUserStats = getUserStats;
