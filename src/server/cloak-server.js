var cloak = require('cloak');

let listOfLobbyUsers = [];

//whenever a username is changed/a player joins the lobby/a player leaves the lobby
//the list of users is updated
var updateLobbyUsers = function(arg) {
    listOfLobbyUsers = [];
    var members = this.getMembers();
    members.forEach(function(user) {
        listOfLobbyUsers.push(user);
    });
    cloak.messageAll('updateusers', getLobbyUserInfo());
};

//all clients are updated with the list of usernames currently in the lobby
function getLobbyUserInfo() {
    let listOfUserInfo = [];
    listOfLobbyUsers.forEach(function(user) {
        var userJson = {
            id: user.id,
            name: user.name,
            ready: user.data.ready
        };
        listOfUserInfo.push(userJson);
    });
    return JSON.stringify(listOfUserInfo);
}

function getRoomUserInfo(room) {
    let listOfRoomUsers = [];
    room.getMembers().forEach(function(user) {
        var userJson = {
            id: user.id,
            name: user.name
        };
        listOfRoomUsers.push(userJson);
    });
    room.messageMembers('updateplayers', JSON.stringify(listOfRoomUsers));
}

module.exports = function(expressServer) {
    cloak.configure({
        autoJoinLobby: false,
        express: expressServer,
        defaultRoomSize: 2,
        messages: {
            setusername: function(msg, user) {
                user.name = msg;
                cloak.getLobby().addMember(user);
            },
            getlobbyinfo: function(msg, user) {
                user.message('userid', user.id);
                user.message('updateusers', getLobbyUserInfo());
            },
            getroominfo: function(msg, user) {
                user.message('userid', user.id);
                getRoomUserInfo(user.getRoom());
            },
            userready: function(msg, user) {
                user.data.ready = msg;
                cloak.messageAll('updateusers', getLobbyUserInfo());
            },
            creategame: function(id, user) {
                var user2 = listOfLobbyUsers.filter(function(user) {
                    return user.id === id;
                })[0];
                const roomName = user.name + " vs " + user2.name;
                const createdRoom = cloak.createRoom(roomName);

                createdRoom.addMember(user);
                createdRoom.addMember(user2);
                user.data.ready = false;
                user2.data.ready = false;
                user.message('joingame', createdRoom.id);
                user2.message('joingame', createdRoom.id);
            },
            winclick: function(winBool, user) {
                const userRoom = user.getRoom();
                if (winBool) {
                    userRoom.messageMembers('gameover', user.id);
                } else {
                    var user2 = userRoom.getMembers().filter(function(usr) {
                        return usr.id !== user.id;
                    })[0];
                    userRoom.messageMembers('gameover', user2.id);
                }
            }
        },
        lobby: {
            newMember: updateLobbyUsers,
            memberLeaves: updateLobbyUsers
        }
    });
    cloak.run();
};
