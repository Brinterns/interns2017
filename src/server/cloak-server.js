var cloak = require('cloak');

let listOfUsers = [];

//whenever a username is changed/a player joins the lobby/a player leaves the lobby
//the list of users is updated
var updateLobbyUsers = function(arg) {
    listOfUsers = [];
    var members = this.getMembers();
    members.forEach( function(user) {
        listOfUsers.push(user);
    });
    cloak.messageAll('updateusers', getUserInfo());
};

//all clients are updated with the list of usernames currently in the lobby
function getUserInfo() {
    let listOfUserInfo = [];
    listOfUsers.forEach(function(user) {
        var userJson = {
            id: user.id,
            name: user.name
        };
        listOfUserInfo.push(userJson);
    });
    return JSON.stringify(listOfUserInfo);
}

module.exports = function(expressServer) {
    cloak.configure({
        express: expressServer,
        messages: {
            setusername: function(msg, user) {
                listOfUsers[listOfUsers.indexOf(user)].name = msg;
                user.name = msg;
                cloak.messageAll('updateusers', getUserInfo());
            },
            getlobbyinfo: function(msg, user) {
                user.message('userid', user.id);
                user.message('updateusers', getUserInfo());
            },
            userready: function(msg, user) {
                user.data.ready = msg;
            }
        },
        lobby: {
            newMember: updateLobbyUsers,
            memberLeaves: updateLobbyUsers
        }
    });
    cloak.run();
};
