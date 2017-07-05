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

function userJoinRoom(user, room) {
    room.addMember(user);
    user.data.ready = false;
}

module.exports = function(expressServer) {
    cloak.configure({
        autoJoinLobby: false,
        express: expressServer,
        pruneEmptyRooms: 10000,
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
                const room = user.getRoom();
                user.message('userid', user.id);
                user.message('roomname', room.name);
                getRoomUserInfo(room);
            },
            userready: function(msg, user) {
                user.data.ready = msg;
                cloak.messageAll('updateusers', getLobbyUserInfo());
            },
            creategame: function(id, user) {
                var user2 = listOfLobbyUsers.filter(function(user) {
                    return user.id === id;
                })[0];
                const createdRoom = cloak.createRoom(user.name + " vs " + user2.name);
                userJoinRoom(user, createdRoom);
                userJoinRoom(user2, createdRoom);
                createdRoom.messageMembers('joingame', createdRoom.id);
            },
            leavegame: function(msg, user) {
                cloak.getLobby().addMember(user);
                user.message('gotolobby');
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
