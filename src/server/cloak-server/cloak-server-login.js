var cloak = require('cloak');
var db = require('../db');
var {getUsername} = require('./randomnames');
var shared = require('./cloak-server-shared');
var lobbyFunctions = require('./cloak-server-lobby');

function setUsername(name, user) {
    user.name = (name === "") ? getUsername(shared.getRandomIntInclusive(0,140)) : name;
    db.find(user.data.dbId).then(function(resp) {
        if (resp) {
            db.update(user.data, user.name);
        } else {
            db.add(user.data.dbId, user.name);
        }
    });
    cloak.getLobby().addMember(user);
}

function setAvatar(avatar, user) {
    db.find(user.data.dbId).then(function(resp) {
        if (resp) {
            db.updateAvatar(user.data, avatar);
            user.data.avatar = avatar;
            cloak.messageAll('updateusers', lobbyFunctions.getLobbyUserInfo());
        } else {
            setTimeout(() => {
                setAvatar(avatar, user);
            }, 10)
        }
    });
}

module.exports.setUsername = setUsername;
module.exports.setAvatar = setAvatar;
