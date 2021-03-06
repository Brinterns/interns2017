var cloak = require('cloak');
var shared = require('./cloak-server-shared');
var lobbyFunctions = require('./cloak-server-lobby');
var powerUpFunctions = require('./cloak-server-powerups');
var gameplay = require('./cloak-server-gameplay');
var EloRank = require('elo-rank');
var db = require('../db');

//returns the ids and names of users in a room
function getRoomUserInfo(room) {
    let listOfRoomUsers = [];
    room.getMembers().forEach(function(user) {
        if (user.data.isPlayer) {
            var userJson = {
                id: user.id,
                name: user.name,
                elorank: user.data.elorank
            };
            listOfRoomUsers.push(userJson);
        }
    });
    const spectatorNames = shared.getSpectators(room).map(function(spectator) {
        return spectator.name;
    });
    room.messageMembers('updatespectators', spectatorNames);
    room.messageMembers('updateplayers', JSON.stringify(listOfRoomUsers));
}

function getRoomInfo(user) {
    const room = user.getRoom();
    if (room && !room.isLobby) {
        if (!room.data.currentPlayer) {
            var startingPlayer = room.getMembers()[shared.getRandomIntInclusive(0, 1)];
            room.data.currentPlayer = startingPlayer.id;
            room.data.moveId = shared.generateMoveId();
            if (user.id === room.data.currentPlayer) {
                user.message('updatemoveid', room.data.moveId);
            } else {
                shared.getOpponent(user).message('updatemoveid', room.data.moveId);
            }
            var d = new Date();
            startingPlayer.data.rollStartTime = d.getTime();
        }
        var opponent;
        if (user.data.isPlayer) {
            opponent = shared.getOpponent(user);
            user.message('activepowerups', powerUpFunctions.getActivePowerUps(user, opponent));
        } else {
            const spectatedPlayer = cloak.getUser(room.data.spectatedId);
            opponent = shared.getOpponent(spectatedPlayer);
            user.data.squares = spectatedPlayer.data.squares;
            user.data.piecePositions = spectatedPlayer.data.piecePositions;
            user.data.numPiecesFinished = spectatedPlayer.data.numPiecesFinished;
            user.message('spectatingid', room.data.spectatedId);
            user.message('activepowerups', powerUpFunctions.getActivePowerUps(spectatedPlayer, shared.getOpponent(spectatedPlayer)));
        }

        var gameStateJson = {
            id: user.id,
            numberOfPieces: room.data.numberOfPieces,
            squares: user.data.squares,
            piecePositions: user.data.piecePositions,
            opponentSquares: opponent ? gameplay.reverseSquares(opponent) : [],
            finishedPieces: user.data.numPiecesFinished,
            finishedOppPieces: opponent ? opponent.data.numPiecesFinished : null,
            winnerId: room.data.winnerId,
            opponentDisconnect: room.data.opponentDisconnect,
            opponentGhostTurns: user.data.ghostTurns,
            ghostTurns: opponent.data.ghostTurns
        };
        if (user.data.ghostTurns) {
            gameStateJson.opponentSquares = Array(24).fill(false);
        }
        user.message('gamestate', JSON.stringify(gameStateJson));
        user.message('pathdata', JSON.stringify({playerPath: room.data.playerPath, opponentPath: room.data.opponentPath, finalPosition: room.data.finalPosition}));
        user.message('currentplayer', room.data.currentPlayer);
        user.message('updatepowerups', JSON.stringify(room.data.powerUps));
        if (opponent && user.data.lastRoll) {
            user.message('rolledvalue', user.data.lastRoll);
            gameplay.checkMoves(user, user.data.lastRoll, opponent.data.squares);
        }
        getRoomUserInfo(room);
    }
}

function getGameInfo(roomId, user) {
    const room = cloak.getRoom(roomId);
    const spectatedPlayer = cloak.getUser(room.data.spectatedId);
    const opponent = shared.getOpponent(spectatedPlayer);
    user.data.squares = spectatedPlayer.data.squares;
    user.data.piecePositions = spectatedPlayer.data.piecePositions;
    user.data.numPiecesFinished = spectatedPlayer.data.numPiecesFinished;
    var gameStateJson = {
        roomId: roomId,
        squares: user.data.squares,
        piecePositions: user.data.piecePositions,
        opponentSquares: opponent ? gameplay.reverseSquares(opponent) : [],
        finishedPieces: user.data.numPiecesFinished,
        finishedOppPieces: opponent ? opponent.data.numPiecesFinished : null,
        winnerId: room.data.winnerId,
        opponentDisconnect: room.data.opponentDisconnect,
        name: spectatedPlayer.name,
        opponentName: opponent.name,
        numberOfPieces: room.data.numberOfPieces,
        powerUps: room.data.powerUps,
        activePowerUps: powerUpFunctions.getActivePowerUps(spectatedPlayer, opponent)
    };
    user.message('pathdata', JSON.stringify({playerPath: room.data.playerPath, opponentPath: room.data.opponentPath, finalPosition: room.data.finalPosition}));
    user.message('minimapstate', JSON.stringify(gameStateJson));
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
    const user1Elo = user.data.elorank;
    if (winBool) {
        userRoom.messageMembers('gameover', user.id);
        userRoom.data.winnerId = user.id;
        user.data.winLossRecord.wins++;
        user2.data.winLossRecord.loses++;
        user.data.elorank = calculateNewElo(user1Elo, user2.data.elorank, 1);
        user2.data.elorank = calculateNewElo(user2.data.elorank, user1Elo, 0);
    } else {
        userRoom.messageMembers('gameover', user2.id);
        userRoom.data.winnerId = user2.id;
        user.data.winLossRecord.loses++;
        user2.data.winLossRecord.wins++;
        user.data.elorank = calculateNewElo(user1Elo, user2.data.elorank, 0);
        user2.data.elorank = calculateNewElo(user2.data.elorank, user1Elo, 1);
    }
    db.update(user.data, user.name);
    db.update(user2.data, user2.name);
    lobbyFunctions.updateLobbyActiveGames();
}

var roomExit = function(arg) {
    const users = this.getMembers();
    const spectatorNames = shared.getSpectators(this).map(function(spectator) {
        return spectator.name;
    });
    this.messageMembers('updatespectators', spectatorNames);
    if (((users.length - spectatorNames.length) === 1) && !this.data.winnerId) {
        this.data.opponentDisconnect = true;
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
            }).then(() => {
                db.update(userData, user.name).then(() => {
                    this.data.winnerId = user.id;
                    user.message('opponentdisconnect');
                    user.message('gameover', this.data.winnerId);
                    spectatorNames.forEach(spectator => {
                        spectator.message('gameover', this.data.winnerId);
                    });
                });
            });
        });
    } else if ((users.length - spectatorNames.length) === 1) {
        const user = users[0];
        this.data.opponentDisconnect = true;
        user.message('opponentdisconnect');
    }
}

module.exports.getRoomInfo = getRoomInfo;
module.exports.getGameInfo = getGameInfo;
module.exports.roomExit = roomExit;
module.exports.win = win;
