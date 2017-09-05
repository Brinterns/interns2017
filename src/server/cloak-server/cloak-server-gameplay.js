var cloak = require('cloak');
var shared = require('./cloak-server-shared');
var gameRoomFunctions = require('./cloak-server-gameroom');
var powerUpFunctions = require('./cloak-server-powerups');

//Game playing variables
const rosettaSquares = [3,5,13,21,23];

const alternateZone = [12, 13, 14, 15, 16];

const powerUpTypes = ['push', 'shield', 'pull', 'reroll', 'swap', 'boot', 'remoteattack', 'ghost'];
const powerUpProbs = [15, 30, 45, 60, 75, 83, 91, 100];

function handleRollDice(user) {
    const room = user.getRoom();
    if (!user.data.rolledDice && !room.data.winnerId) {
        user.data.rolledDice = true;
        const rollNumber = rollDice(user);
        const rollSequence = ("1".repeat(rollNumber) + "0".repeat(4-rollNumber)).split('').sort(function() {return 0.5-Math.random()});
        user.message("rollsequence", rollSequence);
        shared.getOpponent(user).message("opponentsequence", rollSequence);
        shared.getSpectators(room).forEach(function(spectator) {
            spectator.message('opponentsequence', rollSequence);
        });
        setTimeout(() => {
            if (user.data.newId) {
                user = cloak.getUser(user.data.newId);
            }
            messageRoll(rollNumber, user);
            var opponent = shared.getOpponent(user);
            if (rollNumber === 0) {
                if (user.data.powerUp === "reroll") {
                    powerUpFunctions.reRoll(user);
                    user.message('autoreroll');
                } else {
                    endTurn(user);
                }
            } else {
                checkMoves(user, rollNumber, opponent.data.squares);
            }
        }, 1750);
    }
}

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
        return ((position >= (room.data.finalPosition-4)) && (position <= (room.data.finalPosition-1)));
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
    if (user.data.ghostTurns) {
        user.data.ghostTurns --;
        opponent.message('ghost', user.data.ghostTurns);
        user.message('opponentghost', user.data.ghostTurns);
        if (!user.data.ghostTurns) {
            user.message('opponentsquares', reverseSquares(opponent));
        }
    }
    powerUpFunctions.messageActivePowerUps(user, opponent);
    powerUpFunctions.messageActivePowerUps(opponent, user);
    user.data.powerablePieces = [];
}

function canMove(user, opponentSquares, nextPos, moveablePositions, position) {
    const room = user.getRoom();
    const finalPos = room.data.finalPosition;
    const playerPath = room.data.playerPath;
    if (nextPos <= finalPos) {
        const index = user.data.piecePositions.indexOf(position);
        if ((!(rosettaSquares.includes(playerPath[nextPos-1]) && opponentSquares[room.data.opponentPath[nextPos-1]]) && !user.data.squares[playerPath[nextPos-1]]) || (user.data.piecePowerUps[index].powerUp === "boot") || (nextPos === finalPos)) {
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
    user.data.moveablePieces = moveablePositions;
    user.message('moveablepositions', moveablePositions);
}

function movePiece(position, userMoveId, user) {
    var room = user.getRoom();
    const playerPath = room.data.playerPath;
    if (user.data.moveablePieces.includes(position) && (userMoveId === room.data.moveId)) {
        room.data.moveId = shared.generateMoveId();
        var opponent = shared.getOpponent(user);
        var nextPos = position + user.data.lastRoll;
        var userStats = getUserStats(user);
        var d = new Date();
        user.data.moveablePieces = [];
        userStats.totalTimeTaken += milliToSeconds(d.getTime() - user.data.rollStartTime - 1650);

        const nextPosT = shared.translatePosition(room, nextPos);
        const oppIndex = opponent.data.piecePositions.indexOf(nextPosT);
        if ((oppIndex !== -1) && (nextPos > 4) && (nextPos < room.data.warZoneEnd) && opponent.data.piecePowerUps[oppIndex].powerUp === "shield") {
            handleMoveUserPiece(user, opponent, room, position, nextPos, true);
        } else {
            const pieceIndex = user.data.piecePositions.indexOf(position);
            user.data.squares[playerPath[nextPos-1]] = true;
            userStats.squaresMoved += user.data.lastRoll;
            //If piece to move has boot powerup, deal with pieces that the piece passes during the move
            if ((position < room.data.finalPosition) && (user.data.lastRoll > 1) && user.data.piecePowerUps[pieceIndex].powerUp === "boot") {
                handleBootMove(room, user, opponent, position+1, nextPos);
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
    const playerPath = room.data.playerPath;
    if (!shielded && (position !== 0)) {
        user.data.squares[playerPath[position-1]] = false;
    }
    if (nextPos === room.data.finalPosition) {
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
    const nextPosT = shared.translatePosition(room, nextPos);
    if (shielded) {
        const index = opponent.data.piecePositions.indexOf(nextPosT);
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
    if (!opponent.data.ghostTurns) {
        opponent.message('opponentsquares', reverseSquares(user));
    }
    shared.getSpectators(room).forEach(function(spectator) {
        if (user.id === room.data.spectatedId) {
            spectator.message('piecepositions', user.data.piecePositions);
            spectator.message('squares', user.data.squares);
        } else {
            spectator.message('opponentsquares', reverseSquares(user));
        }
    });
}

function handleTakePiece(user, opponent, userStats, room, nextPos) {
    const playerPath = room.data.playerPath;
    //true to be replaced with alternate path condition
    if (!room.data.originalPath && nextPos >= 12) {
        nextPos = alternateZone[alternateZone.length - 1 - alternateZone.indexOf(nextPos)];
    }
    if ((nextPos > 4) && (nextPos < room.data.warZoneEnd) && opponent.data.piecePositions.includes(nextPos)) {
        const oppIndex = opponent.data.piecePositions.indexOf(nextPos);
        opponent.data.piecePositions[oppIndex] = 0;
        opponent.data.piecePowerUps[oppIndex].powerUp = null;
        opponent.data.piecePowerUps[oppIndex].turnsLeft = null;
        opponent.data.squares[playerPath[nextPos-1]] = false;
        opponent.message('piecepositions', opponent.data.piecePositions);
        opponent.message('squares', opponent.data.squares);
        if (!user.data.ghostTurns) {
            user.message('opponentsquares', reverseSquares(opponent));
        }
        shared.getSpectators(room).forEach(function(spectator) {
            if (user.id === room.data.spectatedId) {
                spectator.message('opponentsquares', reverseSquares(opponent));
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
    if (rosettaSquares.includes(room.data.playerPath[position+user.data.lastRoll-1])) {
        room.messageMembers('currentplayer', room.data.currentPlayer);
        user.message('updatemoveid', room.data.moveId);
        user.data.rolledDice = false;
        user.data.rollStartTime = d.getTime();
        user.data.powerablePieces = [];
        return true;
    }
    return false;
}

function handlePowerupTake(user, room, nextPos) {
    const playerPath = room.data.playerPath;
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

function handleBootHit(room, player, position, isUser, opponent) {
    //cannot jump over an opponent piece in their safe zone
    if (!isUser && (position >= player.getRoom().data.warZoneEnd || position <= 4)) {
        return;
    }
    if (!isUser) {
        position = shared.translatePosition(room, position);
    }

    const index = player.data.piecePositions.indexOf(position);
    if (index > -1) {
        if (player.data.piecePowerUps[index].powerUp === "shield") {
            player.data.piecePowerUps[index].powerUp = null;
            player.data.piecePowerUps[index].turnsLeft = null;
        } else {
            player.data.piecePositions[index] = 0;
            player.data.squares[room.data.playerPath[position-1]] = false;
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

function handleBootMove(room, user, opponent, first, final) {
    for (var i = first; i <= final; i ++) {
        handleBootHit(room, user, i, true, opponent);
        handleBootHit(room, opponent, i, false, user);
    }
    powerUpFunctions.updatePiecesMessages(user, reverseSquares(opponent));
    powerUpFunctions.updatePiecesMessages(opponent, reverseSquares(user));
}

function handleFinalRange(user, userStats, room, position, nextPos) {
    if ((nextPos >= room.data.finalPosition-4 && nextPos <= room.data.finalPosition-1) && (!(position >= room.data.finalPosition-4 && position <= room.data.finalPosition-1))) {
        if (user.data.numPiecesFinished === (room.data.numberOfPieces - 1)) {
            userStats.turnsLastInEndRange --;
        }
        userStats.turnsInEndRange --;
    }
}

function reverseSquares(user) {
    const opponentPath = user.getRoom().data.opponentPath;
    var reverse = Array(24).fill(false);
    user.data.piecePositions.forEach(position => {
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
    const playerPath = room.data.playerPath;
    const randomNum = shared.getRandomIntInclusive(0,6);
    if (randomNum < 5 || room.data.powerUps.length >= 2) {
        return;
    }
    //only look to random powerups in war zone
    var freeSquares = [];
    var final = 11;
    if (!room.data.originalPath) {
        final = 10;
        if (!room.data.powerUps.includes(playerPath[13]) && !user.data.squares[playerPath[13]] && !opponent.data.squares[playerPath[13]]) {
            freeSquares.push(playerPath[13]);
        }
    }
    for (var i = 4; i <= final; i++) {
        //if there are no powerups on a space and no player pieces then add the square index as free
        if (!room.data.powerUps.includes(playerPath[i]) && !user.data.squares[playerPath[i]] && !opponent.data.squares[playerPath[i]]) {
            freeSquares.push(playerPath[i]);
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
module.exports.handleRollDice = handleRollDice;
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
