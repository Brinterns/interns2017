var cloak = require('cloak');
var shared = require('./cloak-server-shared');
var gameRoomFunctions = require('./cloak-server-gameroom');

//Game playing variables
const rosettaSquares = [3,5,13,21,23];
const numberOfPieces = 7;
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


function rollDice(user) {
    var total = 0;
    for (var i = 0; i < 4; i ++) {
        total += shared.getRandomIntInclusive(0,1);
    }
    return total;
}

function messageRoll(total, user) {
    user.message('rolledvalue', total);
    shared.getOpponent(user).message('opponentroll', total);
    shared.getSpectators(user.getRoom()).forEach(function(spectator) {
        spectator.message('opponentroll', total);
    });
    user.data.lastRoll = total;
}

function endTurn(user) {
    user.data.rolledDice = false;
    const room = user.getRoom();
    room.data.currentPlayer = shared.getOpponent(user).id;
    room.messageMembers('currentplayer', room.data.currentPlayer);
}

function canMove(squares, opponentSquares, nextPos, moveablePositions, position) {
    if ((nextPos === 15) || (!squares[playerPath[nextPos-1]] && (nextPos < 15))) {
        if (!((nextPos === 8) && opponentSquares[opponentPath[nextPos-1]])) {
            moveablePositions.push(position);
            return true;
        }
    }
    return false;
}

function checkMoves(user, rollNumber, opponentSquares) {
    var moveablePositions = [];
    const moveablePieces = user.data.piecePositions.filter((position) => {
        return (position >= 0) && canMove(user.data.squares, opponentSquares, position + rollNumber, moveablePositions, position);
    });
    if (moveablePieces.length === 0) {
        endTurn(user);
    }
    user.message('moveablepositions', moveablePositions);
}

function movePiece(position, user) {
    const room = user.getRoom();
    var opponent = shared.getOpponent(user);
    var nextPos = position + user.data.lastRoll;
    user.data.squares[playerPath[nextPos-1]] = true;
    if (position !== 0) {
        user.data.squares[playerPath[position-1]] = false;
    }
    if (nextPos === 15) {
        user.data.numPiecesFinished ++;
        user.message('finishedpieces', user.data.numPiecesFinished);
        opponent.message('finishedopppieces', user.data.numPiecesFinished);
        shared.getSpectators(user.getRoom()).forEach(function(spectator) {
            if (user.id === room.data.spectatedId) {
                spectator.message('finishedpieces', user.data.numPiecesFinished);
            } else {
                spectator.message('finishedopppieces', user.data.numPiecesFinished);
            }
        });
        if (user.data.numPiecesFinished === numberOfPieces) {
            gameRoomFunctions.win(true, user);
        }
    }
    user.data.piecePositions[user.data.piecePositions.indexOf(position)] = nextPos;
    user.message('piecepositions', user.data.piecePositions);
    user.message('squares', user.data.squares);
    opponent.message('opponentsquares', reverseSquares(user.data.piecePositions));
    shared.getSpectators(user.getRoom()).forEach(function(spectator) {
        if (user.id === room.data.spectatedId) {
            spectator.message('piecepositions', user.data.piecePositions);
            spectator.message('squares', user.data.squares);
        } else {
            spectator.message('opponentsquares', reverseSquares(user.data.piecePositions));
        }
    });
    if ((nextPos > 4) && (nextPos < 13) && opponent.data.piecePositions.includes(nextPos)) {
        opponent.data.piecePositions[opponent.data.piecePositions.indexOf(nextPos)] = 0;
        opponent.data.squares[playerPath[nextPos-1]] = false;
        opponent.message('piecepositions', opponent.data.piecePositions);
        opponent.message('squares', opponent.data.squares);
        user.message('opponentsquares', reverseSquares(opponent.data.piecePositions));
        shared.getSpectators(user.getRoom()).forEach(function(spectator) {
            if (user.id === room.data.spectatedId) {
                spectator.message('opponentsquares', reverseSquares(opponent.data.piecePositions));
            } else {
                spectator.message('piecepositions', opponent.data.piecePositions);
                spectator.message('squares', opponent.data.squares);
            }
        });
    }
    if (rosettaSquares.includes(playerPath[position+user.data.lastRoll-1])) {
        room.messageMembers('currentplayer', room.data.currentPlayer);
        user.data.rolledDice = false;
        return;
    }
    endTurn(user);
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

module.exports.endTurn = endTurn;
module.exports.rollDice = rollDice;
module.exports.messageRoll = messageRoll;
module.exports.movePiece = movePiece;
module.exports.reverseSquares = reverseSquares;
module.exports.checkMoves = checkMoves;
