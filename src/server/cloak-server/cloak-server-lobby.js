var cloak = require('cloak');
var shared = require('./cloak-server-shared');

 function getLobbyInfo(user) {
    user.message('userid', user.id);
    user.message('updateusers', getLobbyUserInfo());
};

//whenever a username is changed/a player joins the lobby
///a player leaves the lobby the list of users is updated
function updateLobbyUsers(arg) {
    shared.sendMessages(cloak.getLobby());
    cloak.messageAll('updateusers', getLobbyUserInfo());
};

//all clients are updated with the list of usernames currently in the lobbyfunction()
function getLobbyUserInfo() {
    let listOfUserInfo = [];
    cloak.getLobby().getMembers().forEach(function(user) {
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

module.exports.updateLobbyUsers = updateLobbyUsers;
module.exports.updateLobbyActiveGames = updateLobbyActiveGames;
module.exports.getLobbyUserInfo = getLobbyUserInfo;
module.exports.getLobbyInfo = getLobbyInfo;
