var cloak = require('cloak');
var lobbyFunctions = require('./cloak-server-lobby');
var gameRoomFunctions = require('./cloak-server-gameroom');
var gamePlayFunctions = require('./cloak-server-gameplay');
var shared = require('./cloak-server-shared');

function challengePlayer(id, numberOfPieces, user) {
    var user2 = cloak.getUser(id);
    if (!user2.data.challenging) {
        user2.data.challenging = [];
    }
    const existingChallenge = user2.data.challenging.filter(function(challenge) {
        return challenge.id === user.id;
    });
    if (!existingChallenge.length) {
        if (!user.data.challenging) {
            user.data.challenging = [];
        }
        if (!user2.data.challengers) {
            user2.data.challengers = [];
        }
        user.data.challenging.push({id: id, numberOfPieces: numberOfPieces});
        user2.data.challengers.push({id: user.id, numberOfPieces: numberOfPieces});
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
    const challengingUser = cloak.getUser(id);
    const isUserChallenged = challengingUser.data.challenging.filter(function(challenge) {
        return challenge.id === user.id;
    }).length;
    if (isUserChallenged) {
        challengeRespond(user, challengingUser, true);
    }
}

function declineChallenge(id, user) {
    challengeRespond(user, cloak.getUser(id), false);
}

function reChallenge(user, numberOfPieces) {
    var room = user.getRoom();
    const opponent = shared.getOpponent(user);
    room.data.challengerId = user.id;
    room.data.newNumberOfPieces = numberOfPieces;
    user.message('challengerdetails', [room.data.challengerId, room.data.newNumberOfPieces]);
    opponent.message('challengerdetails', [room.data.challengerId, room.data.newNumberOfPieces]);
}

function reChallengeResponse(accept, user) {
    var room = user.getRoom();
    if (accept) {
        challengeRespond(user, shared.getOpponent(user), accept, room.data.newNumberOfPieces);
    } else {
        const opponent = shared.getOpponent(user);
        room.data.challengerId = null;
        room.data.newNumberOfPieces = 7;
        user.message('challengerdetails', [room.data.challengerId, room.data.newNumberOfPieces]);
        opponent.message('challengerdetails', [room.data.challengerId, room.data.newNumberOfPieces]);
    }
}

function challengeRespond(user, user2, accept, numberOfPieces=7) {
    if (!accept) {
        user.data.challengers = user.data.challengers.filter(challenger => {
            return challenger.id !== user2.id;
        });
        user2.data.challenging = user2.data.challenging.filter(challenging => {
            return challenging.id !== user.id;
        });
        user.message('updatechallengers', user.data.challengers);
        user2.message('updatechallenging', user2.data.challenging);
    } else {
        user.data.opponentDbId = user2.data.dbId;
        user2.data.opponentDbId = user.data.dbId;
        numberOfPieces = clearChallenges(user, user2, numberOfPieces);
       
        let createdRoom = cloak.createRoom(user2.name + " vs " + user.name);
        createdRoom.data.opponentDisconnect = false;
        createdRoom.data.messages = [];
        createdRoom.data.numberOfPieces = numberOfPieces;
        userJoinRoom(user, createdRoom);
        userJoinRoom(user2, createdRoom);
        createdRoom.data.spectatedId = user.id;
        createdRoom.messageMembers('joingame', createdRoom.id);
        setTimeout(function() {
            lobbyFunctions.updateLobbyActiveGames();
            lobbyFunctions.updateLobbyUsers();
            gameRoomFunctions.getRoomInfo(user);
            gameRoomFunctions.getRoomInfo(user2);
            initRoomStats(createdRoom, user, user2);
        }, 100);
    }
}

function clearChallenges(user, user2, numberOfPieces) {
    if (!user.data.challenging) {
        user.data.challenging = [];
    }
    if (!user2.data.challengers) {
        user2.data.challengers = [];
    }
    user.data.challengers.forEach(challenger => {
        if (challenger.id !== user2.id) {
            challengeRespond(user, cloak.getUser(challenger.id), false);
        } else {
            numberOfPieces = challenger.numberOfPieces;
        }
    });
    user.data.challenging.forEach(challenging => {
        challengeRespond(cloak.getUser(challenging.id), user, false);
    });
    user2.data.challengers.forEach(challenger => {
        challengeRespond(user2, cloak.getUser(challenger.id), false);
    });
    user2.data.challenging.forEach(challenging => {
        if (challenging.id !== user.id) {
            challengeRespond(cloak.getUser(challenging.id), user2, false);
        }
    });
    user.data.challengers = [];
    user2.data.challenging = [];
    if (isNaN(numberOfPieces)) {
        numberOfPieces = 7;
    } else if (numberOfPieces < 1) {
        numberOfPieces = 1;
    } else if (numberOfPieces > 9) {
        numberOfPieces = 9;
    }
    return Math.ceil(numberOfPieces);
}

function userJoinRoom(user, room) {
    room.addMember(user);
    user.data.isPlayer = true;
    user.data.squares = Array(24).fill(false);
    user.data.piecePositions = Array(room.data.numberOfPieces).fill(0);
    user.data.numPiecesFinished = 0;
    user.data.lastRoll = null;
}

function initRoomStats(room, user, user2) {
    room.data.gameinfo = {};
    room.data.gameinfo.playerIds = [user.id, user2.id];
    const initalPlayerState = {
        piecesTaken: 0,
        piecesLost: 0,
        squaresMoved: 0,
        turnsTaken: 0,
        turnsInEndRange: 0,
        turnsLastInEndRange: 0,
        numberOfRolls: 0,
        totalTimeTaken: 0,
        name: null
    }
    room.data.gameinfo.players = [Object.assign({}, initalPlayerState), Object.assign({}, initalPlayerState)];
    room.data.gameinfo.players[0].name = user.name;
    room.data.gameinfo.players[1].name = user2.name;
    gamePlayFunctions.sendStats(user);
}

module.exports.challengePlayer = challengePlayer;
module.exports.cancelChallenge = cancelChallenge;
module.exports.acceptChallenge = acceptChallenge;
module.exports.declineChallenge = declineChallenge;
module.exports.reChallenge = reChallenge;
module.exports.reChallengeResponse = reChallengeResponse;
