var cloak = require('cloak');
var db = require('../db');
var {getUsername} = require('./randomnames');
var shared = require('./cloak-server-shared');

function setUsername(name, user) {
    user.name = (name === "") ? getUsername(shared.getRandomIntInclusive(0,199)) : name;
    db.find(user.data.dbId).then(function(resp) {
        if (resp) {
            db.update(user.data, user.name);
        } else {
            db.add(user.data.dbId, user.name);
        }
    });
    cloak.getLobby().addMember(user);
}

module.exports.setUsername = setUsername;
