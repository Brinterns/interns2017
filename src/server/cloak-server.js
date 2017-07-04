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
            name: user.name,
            ready: user.data.ready
        };
        listOfUserInfo.push(userJson);
    });
    return JSON.stringify(listOfUserInfo);
}

module.exports = function(expressServer) {
    cloak.configure({
        express: expressServer,
        defaultRoomSize: 2,
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
                cloak.messageAll('updateusers', getUserInfo());
            },
            creategame: function(id, user) {
                var user2 = listOfUsers.filter(function(user) {
                    return user.id === id;
                })[0];
                const roomName = user.name + " vs " + user2.name;
                const createdRoom = cloak.createRoom(roomName);
                createdRoom.addMember(user);
                createdRoom.addMember(user2);
            }
        },
        lobby: {
            newMember: updateLobbyUsers,
            memberLeaves: updateLobbyUsers
        }
    });
    cloak.run();
};
