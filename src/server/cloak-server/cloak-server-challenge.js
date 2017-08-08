var cloak = require('cloak');
var lobbyFunctions = require('./cloak-server-lobby');
var gameRoomFunctions = require('./cloak-server-gameroom');
var shared = require('./cloak-server-shared');
const numberOfPieces = 7;

function challengePlayer(id, user) {
    var user2 = cloak.getUser(id);
    if (!user2.data.challenging) {
        user2.data.challenging = [];
    }
    if (!user2.data.challenging.includes(user.id)) {
        if (!user.data.challenging) {
            user.data.challenging = [];
        }
        if (!user2.data.challengers) {
            user2.data.challengers = [];
        }
        user.data.challenging.push(id);
        user2.data.challengers.push(user.id);
        user.message('updatechallenging', user.data.challenging);
        user2.message('updatechallengers', user2.data.challengers);
        lobbyFunctions.getLobbyUserInfo().then(function(listOfUserInfo) {
            user.message('updateusers', listOfUserInfo);
            user2.message('updateusers', listOfUserInfo);
        });
    }
}

function cancelChallenge(id, user) {
    challengeRespond(cloak.getUser(id), user, false);
}

function acceptChallenge(id, user) {
    challengeRespond(user, cloak.getUser(id), true);
}

function declineChallenge(id, user) {
    challengeRespond(user, cloak.getUser(id), false);
}

function reChallenge(user) {
    const room = user.getRoom();
    room.data.challengerId = user.id;
    room.messageMembers('challengerid', room.data.challengerId);
}

function reChallengeResponse(accept, user) {
    if (accept) {
        challengeRespond(user, shared.getOpponent(user), accept);
    } else {
        const room = user.getRoom();
        room.data.challengerId = null;
        room.messageMembers('challengerid', room.data.challengerId);
    }
}

function challengeRespond(user, user2, accept) {
    if (!accept) {
        user.data.challengers = user.data.challengers.filter(challenger => {
            return challenger !== user2.id;
        });
        user2.data.challenging = user2.data.challenging.filter(challenging => {
            return challenging !== user.id;
        });
        user.message('updatechallengers', user.data.challengers);
        user2.message('updatechallenging', user2.data.challenging);
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
            if (challenger !== user2.id) {
                challengeRespond(user, cloak.getUser(challenger), false);
            }
        });
        user.data.challenging.forEach(challenging => {
            challengeRespond(cloak.getUser(challenging), user, false);
        });
        user2.data.challengers.forEach(challenger => {
            challengeRespond(user2, cloak.getUser(challenger), false);
        });
        user2.data.challenging.forEach(challenging => {
            if (challenging !== user.id) {
                challengeRespond(cloak.getUser(challenging), user2, false);
            }
        });
        user.data.challengers = [];
        user2.data.challenging = [];
        let createdRoom = cloak.createRoom(user2.name + " vs " + user.name);
        createdRoom.data.opponentDisconnect = false;
        userJoinRoom(user, createdRoom);
        userJoinRoom(user2, createdRoom);
        createdRoom.messageMembers('joingame', createdRoom.id);
        setTimeout(function() {
            lobbyFunctions.updateLobbyActiveGames();
            lobbyFunctions.updateLobbyUsers();
            gameRoomFunctions.getRoomInfo(user);
            gameRoomFunctions.getRoomInfo(user2);
        }, 100);
    }
}

function userJoinRoom(user, room) {
    room.addMember(user);
    user.data.player = true;
    user.data.squares = Array(24).fill(false);
    user.data.piecePositions = Array(numberOfPieces).fill(0);
    user.data.numPiecesFinished = 0;
    user.data.lastRoll = null;
}

module.exports.challengePlayer = challengePlayer;
module.exports.cancelChallenge = cancelChallenge;
module.exports.acceptChallenge = acceptChallenge;
module.exports.declineChallenge = declineChallenge;
module.exports.reChallenge = reChallenge;
module.exports.reChallengeResponse = reChallengeResponse;
