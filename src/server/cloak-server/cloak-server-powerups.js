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

module.exports.powerupActivated = powerupActivated;
