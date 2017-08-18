var cloak = require('cloak');
var db = require('../db');
var {getUsername} = require('./randomnames');
var shared = require('./cloak-server-shared');
var lobbyFunctions = require('./cloak-server-lobby');

function setUsername(name, user) {
    user.name = (name === "") ? getUsername(shared.getRandomIntInclusive(0,140)) : name;
    //ensure length of name being set isn't greater than the limit
    if (user.name.length > 15) {
        user.name.slice(0, 14);
    }

    db.find(user.data.dbId).then(function(resp) {
        if (resp) {
            db.update(user.data, user.name);
        } else {
            db.add(user.data.dbId, user.name);
        }
    });
    if (user.getRoom()) {
        shared.updateMessagesId(user.id, user);
        lobbyFunctions.getLobbyUserInfo().then(function(listOfUserInfo) {
            cloak.messageAll('updateusers', listOfUserInfo);
        });
    } else {
        cloak.getLobby().addMember(user);
    }
}

function setAvatar(avatar, user) {
    db.find(user.data.dbId).then(function(resp) {
        if (resp) {
            db.updateAvatar(user.data, avatar).then(function() {
                user.data.avatar = avatar;
                lobbyFunctions.getLobbyUserInfo().then(function(listOfUserInfo) {
                    cloak.messageAll('updateusers', listOfUserInfo);
                });
            });
        } else {
            setTimeout(() => {
                setAvatar(avatar, user);
            }, 10)
        }
    });
}

module.exports.setUsername = setUsername;
module.exports.setAvatar = setAvatar;
