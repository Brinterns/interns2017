var cloak = require('cloak');
var {getUsername} = require('./randomnames');

let listOfLobbyUsers = [];
let messages = [];
const maxMessages = 7;

//Game playing variables
const rosettaSquares = [3,5,13,21,23];
const numberOfPieces = 7;
const playerPath = [
    14, 17, 20, 23,
    22, 19, 16, 13,
    10, 7,  4,  1,
    2,  5
];
const opponentPath = [
    12, 15, 18, 21,
    22, 19, 16, 13,
    10, 7,  4,  1,
    0, 3
];

module.exports = function(expressServer) {
    cloak.configure({
        autoJoinLobby: false,
        express: expressServer,
        pruneEmptyRooms: 1000,
        defaultRoomSize: 2,
        messages: {
            setusername: function(msg, user) {
                user.name = (msg === "") ? getUsername(getRandomIntInclusive(0,199)) : msg;
                cloak.getLobby().addMember(user);
            },
            getlobbyinfo: function(msg, user) {
                getLobbyInfo(user);
                sendMessages();
            },
            getroominfo: function(msg, user) {
                getRoomInfo(user);
            },
            userready: function(_, user) {
                user.data.ready = !user.data.ready;
                cloak.messageAll('updateusers', getLobbyUserInfo());
            },
            challengeplayer: function(id, user) {
                challengePlayer(id, user);
            },
            challengerespond: function(accept, user) {
                challengeRespond(accept, user);
            },
            leavegame: function(msg, user) {
                cloak.getLobby().addMember(user);
                user.message('gotolobby');
            },
            win: function(winBool, user) {
                win(winBool, user);
            },
            reconnectuser: function(id, user) {
                reconnectUser(id, user);
            },
            sendmessage: function(message, user) {
                sendMessage(message, user);
            },
            rolldice: function(_, user) {
                const rollNumber = rollDice(user);
                var opponent = user.getRoom().getMembers().filter((member) => {
                    return member.id !== user.id;
                })[0];
                if (rollNumber === 0) {
                    endTurn(user);
                } else {
                    checkMoves(user, rollNumber, opponent.data.squares);
                }
            },
            movepiece: function(position, user) {
                movePiece(position, user);
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
    const opponent = room.getMembers().filter((member) => {
        return member.id !== user.id;
    })[0];

    var gameStateJson = {
        id: user.id,
        roomName: room.name,
        squares: user.data.squares,
        piecePositions: user.data.piecePositions,
        opponentSquares: reverseSquares(opponent.data.piecePositions),
        finishedPieces: user.data.numPiecesFinished,
        finishedOppPieces: opponent.data.numPiecesFinished,
        winnerId: room.data.winnerId

    };
    user.message('gamestate', JSON.stringify(gameStateJson));
    user.message('currentplayer', room.data.currentPlayer);
    if (user.data.lastRoll) {
        user.message('rolledvalue', user.data.lastRoll);
        checkMoves(user, user.data.lastRoll, opponent.data.squares);
    }
    getRoomUserInfo(room);
}

function challengePlayer(id, user) {
    var user2 = listOfLobbyUsers.filter(function(user) {
        return user.id === id;
    })[0];
    if (!user.data.challenging && !user.data.challenger && !user2.data.challenging && !user2.data.challenger) {
        user.data.challenging = user2.id;
        user2.data.challenger = user.id;
        user.message('waitchallenge', true);
        user2.message('showchallenge', user2.data.challenger);
    }
    cloak.messageAll('updateusers', getLobbyUserInfo());
}

function challengeRespond(accept, user) {
    const challenger = user.data.challenger;
    var user2 = listOfLobbyUsers.filter(function(user) {
        return user.id === challenger;
    })[0];
    user.data.challenger = null;
    user2.data.challenging = null;
    user.message('showchallenge', user.data.challenger);
    user2.message('waitchallenge', false);
    if (!accept) {
        cloak.messageAll('updateusers', getLobbyUserInfo());
        return;
    } else {
        let createdRoom = cloak.createRoom(user2.name + " vs " + user.name);
        userJoinRoom(user2, createdRoom);
        userJoinRoom(user, createdRoom);
        createdRoom.messageMembers('joingame', createdRoom.id);
        updateLobbyActiveGames();
    }
}

function win(winBool, user) {
    var userRoom = user.getRoom();
    var user2 = userRoom.getMembers().filter(function(usr) {
        return usr.id !== user.id;
    })[0];
    if (winBool) {
        userRoom.messageMembers('gameover', user.id);
        userRoom.data.winnerId = user.id;
        user.data.winLossRecord.wins++;
        user2.data.winLossRecord.loses++;
    } else {
        userRoom.messageMembers('gameover', user2.id);
        userRoom.data.winnerId = user2.id;
        user.data.winLossRecord.loses++;
        user2.data.winLossRecord.wins++;
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
        if (!user.data.winLossRecord) {
            user.data.winLossRecord = {wins: 0, loses: 0};
        }
        var userJson = {
            id: user.id,
            name: user.name,
            ready: user.data.ready && !user.data.challenger && !user.data.challenging,
            winLossRecord: user.data.winLossRecord
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
        user.data = user2[0].data;
        user.message('userid', user.id);
        const room = user2[0].getRoom();
        user.joinRoom(room);
        if (room.isLobby) {
            const challenging = user.data.challenging ? true : false;
            user.message('waitchallenge', challenging);
            user.message('showchallenge', user.data.challenger);
            if (user.data.challenging) {
                var opponent = room.getMembers().filter(member => {
                    return member.id === user.data.challenging;
                })[0];
                opponent.data.challenger = user.id;
                opponent.message('showchallenge', opponent.data.challenger);
            } else if (user.data.challenger) {
                var opponent = room.getMembers().filter(member => {
                    return member.id === user.data.challenger;
                })[0];
                opponent.data.challenging = user.id;
            }
        } else {
            user.data.lastRoll = null;
            if (user2[0].id === room.data.currentPlayer) {
                room.data.currentPlayer = user.id;
            }
            if (user2[0].id === room.data.winnerId) {
                room.data.winnerId = user.id;
            }
            user.message('currentplayer', room.data.currentPlayer);
            room.getMembers().filter(member => {
                return (member.id !== user.id) && (member.id !== user2.id);
            })[0].message('currentplayeronly', room.data.currentPlayer);
        }
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
    user.data.lastRoll = total;
    return total;
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
    user.data.squares = Array(24).fill(false);
    user.data.piecePositions = Array(numberOfPieces).fill(0);
    user.data.numPiecesFinished = 0;
    user.data.lastRoll = null;
}
//Game Functions
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function checkMoves(user, rollNumber, opponentSquares) {
    var moveablePositions = [];
    const moveablePieces = user.data.piecePositions.filter((position) => {
        return (position >= 0) && canMove(user.data.squares, opponentSquares, position + rollNumber, moveablePositions, position);
    });
    if (moveablePieces.length === 0) {
        endTurn(user);
    }
    user.message('moveablepositions', moveablePositions);
}

function canMove(squares, opponentSquares, nextPos, moveablePositions, position) {
    if ((nextPos === 15) || (!squares[playerPath[nextPos-1]] && (nextPos < 15))) {
        if (!((nextPos === 8) && opponentSquares[opponentPath[nextPos-1]])) {
            moveablePositions.push(position);
            return true;
        }
    }
    return false;
}

function movePiece(position, user) {
    const room = user.getRoom();
    var opponent = room.getMembers().filter((member) => {
        return member.id !== user.id;
    })[0];
    var nextPos = position + user.data.lastRoll;
    user.data.squares[playerPath[nextPos-1]] = true;
    if (position !== 0) {
        user.data.squares[playerPath[position-1]] = false;
    }
    if (nextPos === 15) {
        nextPos = -1;
        user.data.numPiecesFinished ++;
        user.message('finishedpieces', user.data.numPiecesFinished);
        opponent.message('finishedopppieces', user.data.numPiecesFinished);
        if (user.data.numPiecesFinished === numberOfPieces) {
            win(true, user);
        }
    }
    user.data.piecePositions[user.data.piecePositions.indexOf(position)] = nextPos;
    user.message('piecepositions', user.data.piecePositions);
    user.message('squares', user.data.squares);
    opponent.message('opponentsquares', reverseSquares(user.data.piecePositions));
    if ((nextPos !== -1) && (nextPos > 4) && (nextPos < 13) && opponent.data.piecePositions.includes(nextPos)) {
        opponent.data.piecePositions[opponent.data.piecePositions.indexOf(nextPos)] = 0;
        opponent.data.squares[playerPath[nextPos-1]] = false;
        opponent.message('piecepositions', opponent.data.piecePositions);
        opponent.message('squares', opponent.data.squares);
        user.message('opponentsquares', reverseSquares(opponent.data.piecePositions));
    }
    if (rosettaSquares.includes(playerPath[position+user.data.lastRoll-1])) {
        room.messageMembers('currentplayer', room.data.currentPlayer);
        return;
    }
    endTurn(user);
}

function reverseSquares(positions) {
    var reverse = Array(24).fill(false);
    positions.forEach(position => {
        if (position > 0) {
            reverse[opponentPath[position-1]] = true;
        }
    });
    return reverse;
}
