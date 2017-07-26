var cloak = require('cloak');
var shared = require('./cloak-server-shared');
var gameplay = require('./cloak-server-gameplay');
var EloRank = require('elo-rank');
var db = require('../db');

//returns the ids and names of users in a room
function getRoomUserInfo(room) {
    let listOfRoomUsers = [];
    room.getMembers().forEach(function(user) {
        var userJson = {
            id: user.id,
            name: user.name
        };
        listOfRoomUsers.push(userJson);
    });
    room.messageMembers('updateplayers', JSON.stringify(listOfRoomUsers));
}

function getRoomInfo(user) {
    const room = user.getRoom();
    if (room) {
        if (!room.data.currentPlayer) {
            room.data.currentPlayer = room.getMembers()[1].id;
        }
        const opponent = shared.getOpponent(user);

        var gameStateJson = {
            id: user.id,
            roomName: room.name,
            squares: user.data.squares,
            piecePositions: user.data.piecePositions,
            opponentSquares: gameplay.reverseSquares(opponent.data.piecePositions),
            finishedPieces: user.data.numPiecesFinished,
            finishedOppPieces: opponent.data.numPiecesFinished,
            winnerId: room.data.winnerId
        };
        user.message('gamestate', JSON.stringify(gameStateJson));
        user.message('currentplayer', room.data.currentPlayer);
        if (user.data.lastRoll) {
            user.message('rolledvalue', user.data.lastRoll);
            gameplay.checkMoves(user, user.data.lastRoll, opponent.data.squares);
        }
        getRoomUserInfo(room);
    }
}

function calculateNewElo(playerRank, opponentRank, won) {
    var elo = new EloRank(40);
    return elo.updateRating(elo.getExpected(playerRank, opponentRank), won, playerRank);
}

function win(winBool, user) {
    var userRoom = user.getRoom();
    var user2 = shared.getOpponent(user);
    user.data.opponentDbId = null;
    user2.data.opponentDbId = null;
    if (winBool) {
        userRoom.messageMembers('gameover', user.id);
        userRoom.data.winnerId = user.id;
        user.data.winLossRecord.wins++;
        user2.data.winLossRecord.loses++;
        user.data.elorank = calculateNewElo(user.data.elorank, user2.data.elorank, 1);
        user2.data.elorank = calculateNewElo(user2.data.elorank, user.data.elorank, 0);
    } else {
        userRoom.messageMembers('gameover', user2.id);
        userRoom.data.winnerId = user2.id;
        user.data.winLossRecord.loses++;
        user2.data.winLossRecord.wins++;
        user.data.elorank = calculateNewElo(user.data.elorank, user2.data.elorank, 0);
        user2.data.elorank = calculateNewElo(user2.data.elorank, user.data.elorank, 1);
    }
    db.update(user.data, user.name);
    db.update(user2.data, user2.name);
}

var roomExit = function(arg) {
    const users = this.getMembers();
    if ((users.length === 1) && !users[0].getRoom().data.winnerId) {
        var user = users[0];
        var opponentName;
        var opponentElo;
        var opponentData;
        var userData;
        db.find(user.data.opponentDbId).then(resp => {
            opponentName = resp.name;
            opponentElo = resp.elorank;
            opponentData = {
                dbId: user.data.opponentDbId,
                winLossRecord: {wins: resp.wins, loses: resp.loses + 1},
                elorank: calculateNewElo(opponentElo, user.data.elorank, 0)
            }
        }).then(() => {
            db.update(opponentData, opponentName).then(() => {
                user.data.opponentDbId = null;
                user.data.winLossRecord.wins++;
                user.data.elorank = calculateNewElo(user.data.elorank, opponentElo, 1);
                userData = {
                    dbId: user.data.dbId,
                    winLossRecord: user.data.winLossRecord,
                    elorank: user.data.elorank
                }
            }). then(() => {
                db.update(userData, user.name).then(() => {
                    this.data.winnerId = user.id;
                    user.message('opponentdisconnect');
                    user.message('gameover', this.data.winnerId);
                });
            });
        });
    }
}

module.exports.getRoomInfo = getRoomInfo;
module.exports.roomExit = roomExit;
module.exports.win = win;