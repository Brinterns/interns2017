var cloak = require('cloak');
var lobbyFunctions = require('./cloak-server-lobby');
const numberOfPieces = 7;

function challengePlayer(id, user) {
    var user2 = cloak.getUser(id);
    if (!user.data.challenging && !user.data.challenger && !user2.data.challenging && !user2.data.challenger) {
        user.data.challenging = user2.id;
        user2.data.challenger = user.id;
        user.message('waitchallenge', true);
        user2.message('showchallenge', user2.data.challenger);
    }
    cloak.messageAll('updateusers', lobbyFunctions.getLobbyUserInfo());
}

function cancelChallenge(user) {
    challengeRespond(false, cloak.getUser(user.data.challenging));
}

function userJoinRoom(user, room) {
    room.addMember(user);
    user.data.ready = false;
    user.data.squares = Array(24).fill(false);
    user.data.piecePositions = Array(numberOfPieces).fill(0);
    user.data.numPiecesFinished = 0;
    user.data.lastRoll = null;
}

function challengeRespond(accept, user) {
    const challenger = user.data.challenger;
    var user2 = cloak.getUser(challenger);
    user.data.challenger = null;
    user2.data.challenging = null;
    user.message('showchallenge', user.data.challenger);
    user2.message('waitchallenge', false);
    if (!accept) {
        cloak.messageAll('updateusers', lobbyFunctions.getLobbyUserInfo());
        return;
    } else {
        user.data.opponentDbId = user2.data.dbId;
        user2.data.opponentDbId = user.data.dbId;
        let createdRoom = cloak.createRoom(user2.name + " vs " + user.name);
        userJoinRoom(user2, createdRoom);
        userJoinRoom(user, createdRoom);
        createdRoom.messageMembers('joingame', createdRoom.id);
        lobbyFunctions.updateLobbyActiveGames();
    }
}

module.exports.challengePlayer = challengePlayer;
module.exports.cancelChallenge = cancelChallenge;
module.exports.challengeRespond = challengeRespond;
