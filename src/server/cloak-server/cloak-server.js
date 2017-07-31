var cloak = require('cloak');
var db = require('../db');
var lobbyFunctions = require('./cloak-server-lobby');
var loginFunctions = require('./cloak-server-login');
var sharedFunctions = require('./cloak-server-shared');
var gameRoomFunctions = require('./cloak-server-gameroom');
var gamePlayFunctions = require('./cloak-server-gameplay');
var challengeFunctions = require('./cloak-server-challenge');


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
            setavatar: function(url, user) {
                loginFunctions.setAvatar(url, user);
            },
            getlobbyinfo: function(_, user) {
                lobbyFunctions.getRecord(user);
                lobbyFunctions.getLobbyInfo(user);
                sharedFunctions.sendMessages(user.getRoom());
            },
            getroominfo: function(msg, user) {
                gameRoomFunctions.getRoomInfo(user);
            },
            challengeplayer: function(id, user) {
                challengeFunctions.challengePlayer(id, user);
            },
            cancelchallenge: function(id, user) {
                challengeFunctions.cancelChallenge(id, user);
            },
            acceptchallenge: function(id, user) {
                challengeFunctions.acceptChallenge(id, user);
            },
            declinechallenge: function(id, user) {
                challengeFunctions.declineChallenge(id, user);
            },
            rechallenge: function(_, user) {
                challengeFunctions.reChallenge(user);
            },
            rechallengeresponse: function(accept, user) {
                challengeFunctions.reChallengeResponse(accept, user);
            },
            leavegame: function(msg, user) {
                cloak.getLobby().addMember(user);
                user.message('gotolobby');
                user.message('updatechallenging', user.data.challenging);
                user.message('updatechallengers', user.data.challengesr);
            },
            win: function(winBool, user) {
                gameRoomFunctions.win(winBool, user);
            },
            reconnectuser: function(id, user) {
                sharedFunctions.reconnectUser(id, user);
            },
            sendmessage: function(message, user) {
                sharedFunctions.sendMessage(message, user);
            },
            rolldice: function(_, user) {
                user.data.rolledDice = true;
                const rollNumber = gamePlayFunctions.rollDice(user);
                var opponent = sharedFunctions.getOpponent(user);
                if (rollNumber === 0) {
                    gamePlayFunctions.endTurn(user);
                } else {
                    gamePlayFunctions.checkMoves(user, rollNumber, opponent.data.squares);
                }
            },
            movepiece: function(position, user) {
                gamePlayFunctions.movePiece(position, user);
            }
        },
        lobby: {
            newMember: lobbyFunctions.updateLobbyUsers,
            memberLeaves: lobbyFunctions.updateLobbyUsers
        },
        room: {
            close: lobbyFunctions.updateLobbyActiveGames,
            memberLeaves: gameRoomFunctions.roomExit
        }
    });
    cloak.run();
};
