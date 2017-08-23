var cloak = require('cloak');
var db = require('../db');
var lobbyFunctions = require('./cloak-server-lobby');
var gameRoomFunctions = require('./cloak-server-gameroom');
var powerUpFunctions = require('./cloak-server-powerups');
const maxMessages = 1000;

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateMoveId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 7; ++i) {
        text += possible.charAt(getRandomIntInclusive(0, possible.length-1));
    }
    return text;
}

function getOpponent(user) {
    return user.getRoom().getMembers().filter((member) => {
        return (member.id !== user.id) && member.data.isPlayer;
    })[0];
}

function getSpectators(room) {
    return room.getMembers().filter(member => {
        return !member.data.isPlayer;
    });
}

function sendMessage(message, user) {
    var messageObj = {
        message: message,
        userName: user.name,
        userId: user.id,
        avatar: user.data.avatar
    };
    var userRoom = user.getRoom();
    if (!userRoom.data.messages) {
        userRoom.data.messages = [];
    }
    userRoom.data.messages.push(messageObj);
    if (userRoom.data.messages.length > maxMessages) {
        userRoom.data.messages.splice(0,1);
    }
    sendMessages(userRoom);
}

function sendMessages(room) {
    if (!room.data.messages) {
        room.data.messages = [];
    }
    if (room.data.messages.length > 0) {
        if (room.isLobby) {
            room.messageMembers('updatelobbymessages', JSON.stringify(room.data.messages));
        } else {
            room.messageMembers('updategamemessages', JSON.stringify(room.data.messages));
        }
    }
}

function updateMessagesId(prevId, user) {
    let userRoom = user.getRoom();
    if(userRoom.data.messages) {
        for (var i = 0; i < userRoom.data.messages.length; i ++) {
            if (userRoom.data.messages[i].userId === prevId) {
                userRoom.data.messages[i].userId = user.id;
                userRoom.data.messages[i].userName = user.name;
                userRoom.data.messages[i].avatar = user.data.avatar;
            }
        }
    }
    sendMessages(userRoom);
}

function previousUser(dbId, prevId, user) {
    if (dbId) {
        db.find(dbId).then(function(resp) {
            if (resp) {
                user.name = resp.name;
                user.data.avatar = resp.avatar;
                cloak.getLobby().addMember(user);
                user.message('gotolobby');
                updateMessagesId(prevId, user);
            }
        });
        user.data.dbId = dbId;
    } else {
        user.data.dbId = user.id;
    }
}

function reconnectUser(ids, user) {
    const id = ids[0];
    const dbId = ids[1];
    var user2 = cloak.getUser(id);
    if (user2) {
        if (dbId !== user2.data.dbId) {
            user.message('redirect', "https://www.youtube.com/watch?v=mmLRTVYgEq4");
            return;
        }
        user.name = user2.name;
        user.data = Object.assign({}, user2.data);
        user2.data.newId = user.id;
        user.message('userid', user.id);
        const room = user2.getRoom();
        user.joinRoom(room);
        updateMessagesId(id, user);
        if (room.isLobby) {
            reconnectLobby(user, user2, room);
        } else {
            reconnectGame(user, user2, room);
        }
        user2.delete();
    } else {
        user.message('gotologin');
    }
}

function reconnectLobby(user, user2, room) {
    if (!user.data.challengers) {
        user.data.challengers = [];
    }
    if (!user.data.challenging) {
        user.data.challenging = [];
    }
    user.message('updatechallengers', user.data.challengers);
    user.message('updatechallenging', user.data.challenging);
    user.data.challengers.forEach(challengerInfo => {
        var challenger = cloak.getUser(challengerInfo.id);
        challenger.data.challenging = challenger.data.challenging.map(function(challengingInfo) {
            if (challengingInfo.id === user2.id) {
                challengingInfo.id = user.id;
            }
            return challengingInfo;
        });
        challenger.message('updatechallenging', challenger.data.challenging);
    });
    user.data.challenging.forEach(challengingInfo => {
        var challenging = cloak.getUser(challengingInfo.id);
        challenging.data.challengers = challenging.data.challengers.map(function(challengerInfo) {
            if (challengerInfo.id === user2.id) {
                challengerInfo.id = user.id;
            }
            return challengerInfo;
        });
        challenging.message('updatechallengers', challenging.data.challengers);
    });
    user.message('gotolobby');
}

function reconnectGame(user, user2, room) {
    if (user2.data.isPlayer) {
        if (!user.data.rolledDice) {
            user.data.lastRoll = null;
        }
        if (user2.id === room.data.currentPlayer) {
            room.data.currentPlayer = user.id;
        }
        if (user2.id === room.data.winnerId) {
            room.data.winnerId = user.id;
        }
        if (user2.id === room.data.spectatedId) {
            room.data.spectatedId = user.id;
        }
        if (user2.id === room.data.challengerId) {
            room.data.challengerId = user.id;
        }
        user.message('joingame', room.id);
    } else {
        user.message('spectategame', room.id);
    }
    user.message('currentplayer', room.data.currentPlayer);
    const opponent = room.getMembers().filter(member => {
        return (member.id !== user.id) && (member.id !== user2.id) && member.data.isPlayer;
    })[0];
    if (opponent) {
        opponent.message('currentplayeronly', room.data.currentPlayer);
    }
    getSpectators(room).forEach(spectator => {
        gameRoomFunctions.getRoomInfo(spectator);
    });
    room.data.gameinfo.playerIds[room.data.gameinfo.playerIds.indexOf(user2.id)] = user.id;
    user.message('updatestats', JSON.stringify(room.data.gameinfo));
    user.message('enablepowerups', room.data.enablePowerUps);
    user.message('newpowerup', user.data.powerUp);
    user.message('updategamemessages', JSON.stringify(room.data.messages));
    user.message('challengerdetails', [room.data.challengerId, room.data.newNumberOfPieces, room.data.newEnablePowerUps]);
    powerUpFunctions.messageActivePowerUps(user, opponent);
    if (user.id === room.data.currentPlayer) {
        user.message('updatemoveid', room.data.moveId);
    }
}


module.exports.getRandomIntInclusive = getRandomIntInclusive;
module.exports.generateMoveId = generateMoveId;
module.exports.updateMessagesId = updateMessagesId;
module.exports.sendMessages = sendMessages;
module.exports.getOpponent = getOpponent;
module.exports.getSpectators = getSpectators;
module.exports.sendMessage = sendMessage;
module.exports.reconnectUser = reconnectUser;
module.exports.previousUser = previousUser;
