var cloak = require('cloak');
var db = require('../db');
var lobbyFunctions = require('./cloak-server-lobby');
var loginFunctions = require('./cloak-server-login');
var sharedFunctions = require('./cloak-server-shared');
var gameRoomFunctions = require('./cloak-server-gameroom');
var gamePlayFunctions = require('./cloak-server-gameplay');
var challengeFunctions = require('./cloak-server-challenge');
var powerUpFunctions = require('./cloak-server-powerups');


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
            rejoingame: function(_, user) {
                lobbyFunctions.rejoinGame(user);
            },
            getlobbyinfo: function(_, user) {
                lobbyFunctions.getRecord(user);
                lobbyFunctions.getLobbyInfo(user);
                sharedFunctions.sendMessages(user.getRoom());
            },
            getroominfo: function(msg, user) {
                gameRoomFunctions.getRoomInfo(user);
            },
            getgameinfo: function(roomId, user) {
                gameRoomFunctions.getGameInfo(roomId, user);
            },
            challengeplayer: function(options, user) {
                challengeFunctions.challengePlayer(options[0], options[1], options[2], options[3], user);
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
            observegame: function(gameId, user) {
                lobbyFunctions.observeGame(gameId, user);
            },
            rechallenge: function(options, user) {
                challengeFunctions.reChallenge(user, options[0], options[1], options[2]);
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
                if (winBool) {
                    return;
                }
                gameRoomFunctions.win(winBool, user);
            },
            reconnectuser: function(ids, user) {
                sharedFunctions.reconnectUser(ids, user);
            },
            sendmessage: function(message, user) {
                sharedFunctions.sendMessage(message, user);
            },
            rolldice: function(_, user) {
                gamePlayFunctions.handleRollDice(user);
            },
            movepiece: function(options, user) {
                gamePlayFunctions.movePiece(options[0], options[1], user);
            },
            activatepowerup: function(_, user) {
                powerUpFunctions.powerupActivated(user);
            },
            usepowerup: function(options, user) {
                powerUpFunctions.powerUsed(options[0], options[1], options[2], user);
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
