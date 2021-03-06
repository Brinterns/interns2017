var cloak = require('cloak');
var lobbyFunctions = require('./cloak-server-lobby');
var gameRoomFunctions = require('./cloak-server-gameroom');
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

const playerPathAlternate = [
    14, 17, 20, 23,
    22, 19, 16, 13,
    10, 7,  4,  3,
    0,  1,  2,  5,
    8
];
const opponentPathAlternate = [
    12, 15, 18, 21,
    22, 19, 16, 13,
    10, 7,  4,  5,
    2, 1,   0, 3,
    6
];

function challengePlayer(id, numberOfPieces, enablePowerUps, alternatePath, user) {
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
        user.data.challenging.push({id: id, numberOfPieces: numberOfPieces, enablePowerUps: enablePowerUps, alternatePath: alternatePath});
        user2.data.challengers.push({id: user.id, numberOfPieces: numberOfPieces, enablePowerUps: enablePowerUps, alternatePath: alternatePath});
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

function reChallenge(user, numberOfPieces, enablePowerUps, alternatePath) {
    var room = user.getRoom();
    const opponent = shared.getOpponent(user);
    room.data.challengerId = user.id;
    room.data.newNumberOfPieces = numberOfPieces;
    room.data.newEnablePowerUps = enablePowerUps;
    room.data.newAlternatePath = alternatePath;
    user.message('challengerdetails', [room.data.challengerId, room.data.newNumberOfPieces, room.data.newEnablePowerUps, room.data.newAlternatePath]);
    opponent.message('challengerdetails', [room.data.challengerId, room.data.newNumberOfPieces, room.data.newEnablePowerUps, room.data.newAlternatePath]);
}

function reChallengeResponse(accept, user) {
    var room = user.getRoom();
    if (accept) {
        challengeRespond(user, shared.getOpponent(user), accept, room.data.newNumberOfPieces, room.data.newEnablePowerUps, room.data.newAlternatePath);
    } else {
        const opponent = shared.getOpponent(user);
        room.data.challengerId = null;
        room.data.newNumberOfPieces = 7;
        room.data.newEnablePowerUps = false;
        room.data.newAlternatePath = false;
        user.message('challengerdetails', [room.data.challengerId, room.data.newNumberOfPieces, room.data.newEnablePowerUps, room.data.newAlternatePath]);
        opponent.message('challengerdetails', [room.data.challengerId, room.data.newNumberOfPieces, room.data.newEnablePowerUps, room.data.newAlternatePath]);
    }
}

function challengeRespond(user, user2, accept, numberOfPieces=7, enablePowerUps=false, alternatePath=false) {
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
        const values = clearChallenges(user, user2, numberOfPieces, enablePowerUps, alternatePath);
        numberOfPieces = values[0];
        enablePowerUps = values[1];
        originalPath = !values[2];
        let createdRoom = cloak.createRoom(user2.name + " vs " + user.name);
        roomOptions(createdRoom, values[0], values[1], !values[2], user.id);
        userJoinRoom(user, createdRoom);
        userJoinRoom(user2, createdRoom);
        createdRoom.messageMembers('joingame', createdRoom.id);
        createdRoom.messageMembers('enablepowerups', createdRoom.data.enablePowerUps);
        setTimeout(function() {
            createdRoom.messageMembers('pathdata', JSON.stringify({playerPath: createdRoom.data.playerPath, opponentPath: createdRoom.data.opponentPath, finalPosition: createdRoom.data.finalPosition}));
            lobbyFunctions.updateLobbyActiveGames();
            lobbyFunctions.updateLobbyUsers();
            gameRoomFunctions.getRoomInfo(user);
            gameRoomFunctions.getRoomInfo(user2);
            initRoomStats(createdRoom, user, user2);
        }, 100);
    }
}

function clearChallenges(user, user2, numberOfPieces, enablePowerUps, alternatePath) {
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
            enablePowerUps = challenger.enablePowerUps;
            alternatePath = challenger.alternatePath;
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
    return [Math.ceil(numberOfPieces), enablePowerUps, alternatePath];
}

function roomOptions(room, numberOfPieces, enablePowerUps, originalPath, spectatedId) {
    room.data.spectatedId = spectatedId;
    room.data.opponentDisconnect = false;
    room.data.messages = [];
    room.data.numberOfPieces = numberOfPieces;
    room.data.powerUps = [];
    room.data.enablePowerUps = enablePowerUps;
    room.data.originalPath = originalPath;
    if (originalPath) {
        room.data.playerPath = playerPath;
        room.data.opponentPath = opponentPath;
        room.data.finalPosition = 15;
        room.data.warZoneEnd = 13;
    } else {
        room.data.playerPath = playerPathAlternate;
        room.data.opponentPath = opponentPathAlternate;
        room.data.finalPosition = 17;
        room.data.warZoneEnd = 17;
    }
}

function userJoinRoom(user, room) {
    room.addMember(user);
    user.data.isPlayer = true;
    user.data.squares = Array(24).fill(false);
    user.data.piecePositions = Array(room.data.numberOfPieces).fill(0);
    user.data.piecePowerUps = Array(room.data.numberOfPieces).fill({powerUp: null, turnsLeft: null, squareIndex: 0, position: 0});
    user.data.numPiecesFinished = 0;
    user.data.lastRoll = null;
    user.data.ghostTurns = 0;
    user.data.powerUp = null;
    user.data.moveablePieces = [];
    user.data.powerablePieces = [];
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
        powerUpsCollected: 0,
        powerUpsUsed: 0,
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
