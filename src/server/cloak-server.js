var cloak = require('cloak');
var {getUsername} = require('./randomnames');
var db = require('./db');
var EloRank = require('elo-rank');
let listOfLobbyUsers = [];
const maxMessages = 1000;

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
            previoususer: function(idsIn, user) {
                previousUser(idsIn[0],idsIn[1], user);
            },
            setusername: function(name, user) {
                setUsername(name, user);
            },
            getlobbyinfo: function(_, user) {
                getRecord(user);
                getLobbyInfo(user);
                sendMessages(user.getRoom());
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
            cancelchallenge: function(_, user) {
                cancelChallenge(user);
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
                user.data.rolledDice = true;
                const rollNumber = rollDice(user);
                var opponent = getOpponent(user);
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
            close: updateLobbyActiveGames,
            memberLeaves: roomExit
        },
    });
    cloak.run();
};

function getOpponent(user) {
    return user.getRoom().getMembers().filter((member) => {
        return member.id !== user.id;
    })[0];
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

function setUsername(name, user) {
    user.name = (name === "") ? getUsername(getRandomIntInclusive(0,199)) : name;
    db.find(user.data.dbId).then(function(resp) {
        if (resp) {
            db.update(user.data, user.name);
        } else {
            db.add(user.data.dbId, user.name);
        }
    });
    cloak.getLobby().addMember(user);
}

function getRecord(user) {
    if (user.data.dbId) {
        db.find(user.data.dbId).then(function(resp) {
            user.data.winLossRecord.wins = resp.wins;
            user.data.winLossRecord.loses = resp.loses;
            user.data.elorank = resp.elorank;
            cloak.messageAll('updateusers', getLobbyUserInfo());
        });
    }
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

function getLobbyInfo(user) {
    user.message('userid', user.id);
    user.message('updateusers', getLobbyUserInfo());
};

function getRoomInfo(user) {
    const room = user.getRoom();
    if (room) {
        if (!room.data.currentPlayer) {
            room.data.currentPlayer = room.getMembers()[1].id;
        }
        const opponent = getOpponent(user);

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
}

function challengePlayer(id, user) {
    var user2 = cloak.getUser(id);
    if (!user.data.challenging && !user.data.challenger && !user2.data.challenging && !user2.data.challenger) {
        user.data.challenging = user2.id;
        user2.data.challenger = user.id;
        user.message('waitchallenge', true);
        user2.message('showchallenge', user2.data.challenger);
    }
    cloak.messageAll('updateusers', getLobbyUserInfo());
}

function cancelChallenge(user) {
    challengeRespond(false, cloak.getUser(user.data.challenging));
}

function challengeRespond(accept, user) {
    const challenger = user.data.challenger;
    var user2 = cloak.getUser(challenger);
    user.data.challenger = null;
    user2.data.challenging = null;
    user.message('showchallenge', user.data.challenger);
    user2.message('waitchallenge', false);
    if (!accept) {
        cloak.messageAll('updateusers', getLobbyUserInfo());
        return;
    } else {
        user.data.opponentDbId = user2.data.dbId;
        user2.data.opponentDbId = user.data.dbId;
        let createdRoom = cloak.createRoom(user2.name + " vs " + user.name);
        userJoinRoom(user2, createdRoom);
        userJoinRoom(user, createdRoom);
        createdRoom.messageMembers('joingame', createdRoom.id);
        updateLobbyActiveGames();
    }
}

function calculateNewElo(playerRank, opponentRank, won) {
    var elo = new EloRank(40);
    return elo.updateRating(elo.getExpected(playerRank, opponentRank), won, playerRank);
}


function win(winBool, user) {
    var userRoom = user.getRoom();
    var user2 = getOpponent(user);
    user.data.opponentDbId = null;
    user2.data.opponentDbId = null;

    if (winBool) {
        userRoom.messageMembers('gameover', user.id);
        userRoom.data.winnerId = user.id;
        user.data.winLossRecord.wins++;
        user2.data.winLossRecord.loses++;
        user.data.elorank = calculateNewElo(user.data.elorank, user2.data.elorank, 1);
        user2.data.elorank = calculateNewElo(user2.data.elorank, user.data.elorank, 0);
    } else {
        userRoom.messageMembers('gameover', user2.id);
        userRoom.data.winnerId = user2.id;
        user.data.winLossRecord.loses++;
        user2.data.winLossRecord.wins++;
        user.data.elorank = calculateNewElo(user.data.elorank, user2.data.elorank, 0);
        user2.data.elorank = calculateNewElo(user2.data.elorank, user.data.elorank, 1);
    }
    db.update(user.data, user.name);
    db.update(user2.data, user2.name);
}

var roomExit = function(arg) {
    const users = this.getMembers();
    if (users.length < 2) {
        var user = users[0];
        var opponentName;
        var opponentElo;
        var opponentData;
        var userData;
        db.find(user.data.opponentDbId).then(resp => {
            opponentName = resp.name;
            opponentElo = resp.elorank;
            opponentData = {
                dbId: user.data.opponentDbId,
                winLossRecord: {wins: resp.wins, loses: resp.loses + 1},
                elorank: calculateNewElo(opponentElo, user.data.elorank, 0)
            }
        }).then(() => {
            db.update(opponentData, opponentName).then(() => {
                user.data.opponentDbId = null;
                user.data.winLossRecord.wins++;
                user.data.elorank = calculateNewElo(user.data.elorank, opponentElo, 1);
                userData = {
                    dbId: user.data.dbId,
                    winLossRecord: user.data.winLossRecord,
                    elorank: user.data.elorank
                }
            }). then(() => {
                db.update(userData, user.name).then(() => {
                    this.data.winnerId = user.id;
                    user.message('opponentdisconnect');
                    user.message('gameover', this.data.winnerId);
                });
            });
        });
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
    sendMessages(cloak.getLobby());
    cloak.messageAll('updateusers', getLobbyUserInfo());
};

//all clients are updated with the list of usernames currently in the lobby
function getLobbyUserInfo() {
    let listOfUserInfo = [];
    listOfLobbyUsers.forEach(function(user) {
        if (!user.data.winLossRecord) {
            user.data.winLossRecord = {wins: 0, loses: 0};
            user.data.elorank = 1200;
        }
        var userJson = {
            id: user.id,
            name: user.name,
            ready: user.data.ready,
            inChallenge: user.data.challenger || user.data.challenging,
            winLossRecord: user.data.winLossRecord,
            elorank: user.data.elorank
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

function rollDice(user) {
    var total = 0;
    for (var i = 0; i < 4; i ++) {
        total += getRandomIntInclusive(0,1);
    }
    user.message('rolledvalue', total);
    getOpponent(user).message('opponentroll', total);
    user.data.lastRoll = total;
    return total;
}

function endTurn(user) {
    user.data.rolledDice = false;
    const room = user.getRoom();
    room.data.currentPlayer = getOpponent(user).id;
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
    var opponent = getOpponent(user);
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
        user.data.rolledDice = false;
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
