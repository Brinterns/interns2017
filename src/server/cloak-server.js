var cloak = require('cloak');

let listOfLobbyUsers = [];
let messages = [];
const maxMessages = 7;

module.exports = function(expressServer) {
    cloak.configure({
        autoJoinLobby: false,
        express: expressServer,
        pruneEmptyRooms: 1000,
        defaultRoomSize: 2,
        messages: {
            setusername: function(msg, user) {
                user.name = msg;
                cloak.getLobby().addMember(user);
            },
            getlobbyinfo: function(msg, user) {
                getLobbyInfo(user);
                sendMessages();
            },
            getroominfo: function(msg, user) {
                getRoomInfo(user);
            },
            userready: function(msg, user) {
                user.data.ready = msg;
                cloak.messageAll('updateusers', getLobbyUserInfo());
            },
            creategame: function(id, user) {
                createGame(id,user);
            },
            leavegame: function(msg, user) {
                cloak.getLobby().addMember(user);
                user.message('gotolobby');
            },
            winclick: function(winBool, user) {
                winClick(winBool, user);
            },
            reconnectuser: function(id, user) {
                reconnectUser(id, user);
            },
            sendmessage: function(message, user) {
                sendMessage(message, user);
            },
            rolldice: function(_, user) {
                rollDice(user);
            },
            endturn: function(_, user) {
                endTurn(user);
            }
        },
        lobby: {
            newMember: updateLobbyUsers,
            memberLeaves: updateLobbyUsers
        },
        room: {
            close: updateLobbyActiveGames
        },
    });
    cloak.run();
};

function sendMessages() {
    if (messages.length > 0) {
        cloak.getLobby().messageMembers('updatemessages', JSON.stringify(messages));
    }
}

function getLobbyInfo(user) {
    user.message('userid', user.id);
    user.message('updateusers', getLobbyUserInfo());
};

function getRoomInfo(user) {
    const room = user.getRoom();
    if (!room.data.currentPlayer) {
        room.data.currentPlayer = room.getMembers()[1].id;
    }
    user.message('userid', user.id);
    user.message('roomname', room.name);
    user.message('currentplayer', room.data.currentPlayer);
    getRoomUserInfo(room);
}

function createGame(id, user) {
    var user2 = listOfLobbyUsers.filter(function(user) {
        return user.id === id;
    })[0];
    let createdRoom = cloak.createRoom(user.name + " vs " + user2.name);
    userJoinRoom(user, createdRoom);
    userJoinRoom(user2, createdRoom);
    createdRoom.messageMembers('joingame', createdRoom.id);
    updateLobbyActiveGames();
}

function winClick(winBool, user) {
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
//whenever a username is changed/a player joins the lobby
///a player leaves the lobby the list of users is updated
var updateLobbyUsers = function(arg) {

    listOfLobbyUsers = [];
    var members = this.getMembers();
    members.forEach(function(user) {
        listOfLobbyUsers.push(user);
    });
    sendMessages();
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
    updateLobbyActiveGames();
    return JSON.stringify(listOfUserInfo);
}
//updates lobby users with active game names
function updateLobbyActiveGames() {
    let activeGameNames = [];
    cloak.getRooms().forEach(function(room) {
        if(room.members.length > 0) {
            activeGameNames.push(room.name);
        }
    });
    cloak.getLobby().messageMembers('updaterooms', activeGameNames);
}
//returns the ids and names of users in a room
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

function reconnectUser(id, user) {
    var user2 = cloak.getUsers().filter(function(user) {
        return user.id === id;
    });
    if (user2.length) {
        user.name = user2[0].name;
        user.ready = user2[0].ready;
        user.message('userid', user.id);
        const room = user2[0].getRoom();
        user.joinRoom(room);
        if (user2[0].id === room.data.currentPlayer) {
            room.data.currentPlayer = user.id;
        }
        user.message('currentplayer', room.data.currentPlayer);
        user2[0].delete();
    }
}

function sendMessage(message, user) {
    var messageObj = {
        message: message,
        userName: user.name,
        userId: user.id
    };
    messages.push(messageObj);
    if (messages.length > maxMessages) {
        messages.splice(0,1);
    }
    sendMessages();
}

function rollDice(user) {
    var total = 0;
    for (var i = 0; i < 4; i ++) {
        total += getRandomIntInclusive(0,1);
    }
    user.message('rolledvalue', total);
    user.getRoom().getMembers().filter((member) => {
        return member.id !== user.id;
    })[0].message('opponentroll', total);
}

function endTurn(user) {
    const room = user.getRoom();
    room.data.currentPlayer = room.getMembers().filter(function(userTemp) {
        return userTemp.id !== user.id;
    })[0].id;
    room.messageMembers('currentplayer', room.data.currentPlayer);
}

function userJoinRoom(user, room) {
    room.addMember(user);
    user.data.ready = false;
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}
