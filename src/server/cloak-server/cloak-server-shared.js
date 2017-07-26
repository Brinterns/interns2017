var cloak = require('cloak');
var db = require('../db');
const maxMessages = 1000;

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getOpponent(user) {
    return user.getRoom().getMembers().filter((member) => {
        return member.id !== user.id;
    })[0];
}

function sendMessage(message, user) {
    var messageObj = {
        message: message,
        userName: user.name,
        userId: user.id
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

function reconnectUser(id, user) {
    var user2 = cloak.getUser(id);
    if (user2) {
        user.name = user2.name;
        user.data = user2.data;
        user.message('userid', user.id);
        const room = user2.getRoom();
        user.joinRoom(room);
        updateMessagesId(id, user);
        if (room.isLobby) {
            const challenging = user.data.challenging ? true : false;
            user.message('waitchallenge', challenging);
            user.message('showchallenge', user.data.challenger);
            if (user.data.challenging) {
                var opponent = cloak.getUser(user.data.challenging);
                opponent.data.challenger = user.id;
                opponent.message('showchallenge', opponent.data.challenger);
            } else if (user.data.challenger) {
                var opponent = cloak.getUser(user.data.challenger);
                opponent.data.challenging = user.id;
            }
            user.message('gotolobby');
        } else {
            if (!user.data.rolledDice) {
                user.data.lastRoll = null;
            }
            if (user2.id === room.data.currentPlayer) {
                room.data.currentPlayer = user.id;
            }
            if (user2.id === room.data.winnerId) {
                room.data.winnerId = user.id;
            }
            user.message('currentplayer', room.data.currentPlayer);
            room.getMembers().filter(member => {
                return (member.id !== user.id) && (member.id !== user2.id);
            })[0].message('currentplayeronly', room.data.currentPlayer);
        }
        user2.delete();
    } else {
        user.message('gotologin');
    }
}


module.exports.getRandomIntInclusive = getRandomIntInclusive;
module.exports.sendMessages = sendMessages;
module.exports.getOpponent = getOpponent;
module.exports.sendMessage = sendMessage;
module.exports.reconnectUser = reconnectUser;
module.exports.previousUser = previousUser;