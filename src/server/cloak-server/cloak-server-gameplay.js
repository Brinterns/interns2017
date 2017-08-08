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
    user.data.lastRoll = total;
}

function endTurn(user) {
    user.data.rolledDice = false;
    const room = user.getRoom();
    room.data.currentPlayer = shared.getOpponent(user).id;
    const numPiecesEndRange = user.data.piecePositions.filter((position) => {
        return (position >= 11 && position <= 14);
    }).length;
    getUserStats(user).turnsInEndRange += numPiecesEndRange;
    if ((user.data.numPiecesFinished === (numberOfPieces - 1)) && (numPiecesEndRange === 1)) {
        getUserStats(user).turnsLastInEndRange ++;
    }
    room.messageMembers('currentplayer', room.data.currentPlayer);
    console.log("Player 1 = " + JSON.stringify(room.data.gameinfo.players[0]));
    console.log("Player 2 = " + JSON.stringify(room.data.gameinfo.players[1]));
    console.log("\n");
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
    var userStats = getUserStats(user);
    user.data.squares[playerPath[nextPos-1]] = true;
    userStats.squaresMoved += user.data.lastRoll;
    if (position !== 0) {
        user.data.squares[playerPath[position-1]] = false;
    }
    if (nextPos === 15) {
        user.data.numPiecesFinished ++;
        user.message('finishedpieces', user.data.numPiecesFinished);
        opponent.message('finishedopppieces', user.data.numPiecesFinished);
        if (user.data.numPiecesFinished === numberOfPieces) {
            gameRoomFunctions.win(true, user);
        }
    }
    user.data.piecePositions[user.data.piecePositions.indexOf(position)] = nextPos;
    user.message('piecepositions', user.data.piecePositions);
    user.message('squares', user.data.squares);
    opponent.message('opponentsquares', reverseSquares(user.data.piecePositions));
    //If the moved piece lands on an opponent piece, the opponent piece is sent back to starting position
    if ((nextPos > 4) && (nextPos < 13) && opponent.data.piecePositions.includes(nextPos)) {
        opponent.data.piecePositions[opponent.data.piecePositions.indexOf(nextPos)] = 0;
        opponent.data.squares[playerPath[nextPos-1]] = false;
        opponent.message('piecepositions', opponent.data.piecePositions);
        opponent.message('squares', opponent.data.squares);
        user.message('opponentsquares', reverseSquares(opponent.data.piecePositions));
        userStats.piecesTaken ++;
        getUserStats(opponent).piecesLost ++;
    }
    if (rosettaSquares.includes(playerPath[position+user.data.lastRoll-1])) {
        room.messageMembers('currentplayer', room.data.currentPlayer);
        user.data.rolledDice = false;
        return;
    }
    //balances out the increment for this piece being in the final range as it has just moved there
    if ((nextPos >= 11 && nextPos <= 14) && (!(position >= 11 && position <= 14))) {
        if (user.data.numPiecesFinished === (numberOfPieces - 1)) {
            userStats.turnsLastInEndRange --;
        }
        userStats.turnsInEndRange --;
    }

    userStats.turnsTaken ++;
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

function getUserStats(user) {
    let room = user.getRoom();
    return userStats = room.data.gameinfo.players[room.data.gameinfo.playerIds.indexOf(user.id)];
}

module.exports.endTurn = endTurn;
module.exports.rollDice = rollDice;
module.exports.messageRoll = messageRoll;
module.exports.movePiece = movePiece;
module.exports.reverseSquares = reverseSquares;
module.exports.checkMoves = checkMoves;
