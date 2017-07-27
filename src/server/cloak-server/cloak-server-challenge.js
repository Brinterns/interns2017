var cloak = require('cloak');
var lobbyFunctions = require('./cloak-server-lobby');
const numberOfPieces = 7;

function challengePlayer(id, user) {
    var user2 = cloak.getUser(id);
    if (!user.data.challenging) {
        user.data.challenging = [];
    }
    if (!user2.data.challengers) {
        user2.data.challengers = [];
    }
    user.data.challenging.push(id);
    user2.data.challengers.push(user.id);
    user.message('updatechallenging', user.data.challenging);
    user.message('updateusers', lobbyFunctions.getLobbyUserInfo());
    user2.message('updatechallengers', user2.data.challengers);
    user2.message('updateusers', lobbyFunctions.getLobbyUserInfo());
}

function cancelChallenge(id, user) {
    challengeRespond(user.id, cloak.getUser(id), false);
}

function acceptChallenge(id, user) {
    challengeRespond(id, user, true);
}

function declineChallenge(id, user) {
    challengeRespond(id, user, false);
}

function challengeRespond(challengerId, user, accept) {
    var user2 = cloak.getUser(challengerId);
    if (!accept) {
        user.data.challengers = user.data.challengers.filter(challenger => {
            return challenger !== challengerId;
        });
        user2.data.challenging = user2.data.challenging.filter(challenging => {
            return challenging !== user.id;
        });
        user.message('updatechallengers', user.data.challengers);
        user2.message('updatechallenging', user.data.challenging);
    } else {
        user.data.opponentDbId = user2.data.dbId;
        user2.data.opponentDbId = user.data.dbId;
        if (!user.data.challenging) {
            user.data.challenging = [];
        }
        if (!user2.data.challengers) {
            user2.data.challengers = [];
        }
        user.data.challengers.forEach(challenger => {
            if (challenger !== challengerId) {
                challengeRespond(challenger, user, false);
            }
        });
        user.data.challenging.forEach(challenging => {
            challengeRespond(user.id, cloak.getUser(challenging), false);
        });
        user2.data.challengers.forEach(challenger => {
            challengeRespond(challenger.id, user, false);
        });
        user2.data.challenging.forEach(challenging => {
            if (challenging !== user.id) {
                challengeRespond(user.id, cloak.getUser(challenging), false);
            }
        });
        user.data.challengers = [];
        user2.data.challenging = [];
        let createdRoom = cloak.createRoom(user2.name + " vs " + user.name);
        userJoinRoom(user2, createdRoom);
        userJoinRoom(user, createdRoom);
        createdRoom.messageMembers('joingame', createdRoom.id);
        lobbyFunctions.updateLobbyActiveGames();
    }
}

function userJoinRoom(user, room) {
    room.addMember(user);
    user.data.ready = false;
    user.data.squares = Array(24).fill(false);
    user.data.piecePositions = Array(numberOfPieces).fill(0);
    user.data.numPiecesFinished = 0;
    user.data.lastRoll = null;
}

module.exports.challengePlayer = challengePlayer;
module.exports.cancelChallenge = cancelChallenge;
module.exports.acceptChallenge = acceptChallenge;
module.exports.declineChallenge = declineChallenge;
