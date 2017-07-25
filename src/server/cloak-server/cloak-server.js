var cloak = require('cloak');
var db = require('../db');
var lobbyFunctions = require('./cloak-server-lobby');
var loginFunctions = require('./cloak-server-login');
var sharedFunctions = require('./cloak-server-shared');
var challengeFunctions = require('./cloak-server-challenge');
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
                sharedFunctions.previousUser(idsIn[0],idsIn[1], user);
            },
            setusername: function(name, user) {
                loginFunctions.setUsername(name, user);
            },
            getlobbyinfo: function(_, user) {
                getRecord(user);
                lobbyFunctions.getLobbyInfo(user);
                sharedFunctions.sendMessages(user.getRoom());
            },
            getroominfo: function(msg, user) {
                getRoomInfo(user);
            },
            userready: function(_, user) {
                user.data.ready = !user.data.ready;
                cloak.messageAll('updateusers', lobbyFunctions.getLobbyUserInfo());
            },
            challengeplayer: function(id, user) {
                challengeFunctions.challengePlayer(id, user);
            },
            cancelchallenge: function(_, user) {
                challengeFunctions.cancelChallenge(user);
            },
            challengerespond: function(accept, user) {
                challengeFunctions.challengeRespond(accept, user);
            },
            leavegame: function(msg, user) {
                cloak.getLobby().addMember(user);
                user.message('gotolobby');
            },
            win: function(winBool, user) {
                win(winBool, user);
            },
            reconnectuser: function(id, user) {
                sharedFunctions.reconnectUser(id, user);
            },
            sendmessage: function(message, user) {
                sharedFunctions.sendMessage(message, user);
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
            newMember: lobbyFunctions.updateLobbyUsers,
            memberLeaves: lobbyFunctions.updateLobbyUsers
        },
        room: {
            close: lobbyFunctions.updateLobbyActiveGames,
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




function getRecord(user) {
    if (user.data.dbId) {
        db.find(user.data.dbId).then(function(resp) {
            user.data.winLossRecord.wins = resp.wins;
            user.data.winLossRecord.loses = resp.loses;
            user.data.elorank = resp.elorank;
            cloak.messageAll('updateusers', lobbyFunctions.getLobbyUserInfo());
        });
    }
}




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
    if (users.length === 1) {
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



function rollDice(user) {
    var total = 0;
    for (var i = 0; i < 4; i ++) {
        total += sharedFunctions.getRandomIntInclusive(0,1);
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
