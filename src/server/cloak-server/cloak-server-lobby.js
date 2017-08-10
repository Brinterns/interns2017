var cloak = require('cloak');
var db = require('../db');
var shared = require('./cloak-server-shared');

function getLobbyInfo(user) {
    user.message('userid', user.id);
    getLobbyUserInfo().then(function(listOfUserInfo) {
        user.message('updateusers', listOfUserInfo);
    });
};

//whenever a username is changed/a player joins the lobby
///a player leaves the lobby the list of users is updated
function updateLobbyUsers() {
    shared.sendMessages(cloak.getLobby());
    getLobbyUserInfo().then(function(listOfUserInfo) {
        cloak.messageAll('updateusers', listOfUserInfo);
    });
};

function clearDisconnected(userList) {
    if (!userList) {
        return [];
    }
    let newList = [];
    for (var i = 0; i < userList.length; ++i) {
        const opponent = cloak.getUser(userList[i]);
        if (opponent && opponent.connected()) {
            newList.push(opponent.id);
        }
    }
    return newList;
}
//all clients are updated with the list of usernames currently in the lobbyfunction()
function getLobbyUserInfo() {
    return new Promise(function(resolve, reject) {
        let listOfUserInfo = [];
        let listOfDbIds = [];
        cloak.getUsers().forEach(function(user, index, cloakUsers) {
            const room = user.getRoom();
            if (room) {
                listOfDbIds.push(user.data.dbId);
                if (!user.data.winLossRecord) {
                    user.data.winLossRecord = {wins: 0, loses: 0};
                    user.data.elorank = 1200;
                }
                var userJson = {
                    id: user.id,
                    name: user.name,
                    inChallenge: user.data.challenger || user.data.challenging,
                    winLossRecord: user.data.winLossRecord,
                    elorank: user.data.elorank,
                    avatar: user.data.avatar,
                    inLobby: room.isLobby,
                    online: true,
                    rank: null
                };
                if (room.isLobby) {
                    user.data.challenging = clearDisconnected(user.data.challenging);
                    user.data.challengers = clearDisconnected(user.data.challengers);
                    userJson.inChallenge = user.data.challenger || user.data.challenging;
                    listOfUserInfo.unshift(userJson);
                } else {
                    listOfUserInfo.push(userJson);
                }
            }
            if (index === (cloakUsers.length - 1)) {
                resolve(new Promise(function(resolve, reject) {
                    const allUsers = db.getAllUsers();
                    allUsers.count().then(function(size) {
                        let count = 0;
                        allUsers.forEach(function(dbUser) {
                            if (!listOfDbIds.includes(dbUser.cloakid)) {
                                var dbUserJson = {
                                    id: null,
                                    name: dbUser.name,
                                    inChallenge: false,
                                    winLossRecord: {wins: dbUser.wins, loses: dbUser.loses},
                                    elorank: dbUser.elorank,
                                    avatar: dbUser.avatar,
                                    inLobby: false,
                                    online: false,
                                    rank: null
                                }
                                listOfUserInfo.push(dbUserJson);
                            }
                            if (count === (size - 1)) {
                                var sortedList = Object.assign([], listOfUserInfo);
                                sortedList.sort(function(a, b) {
                                    return b.elorank - a.elorank;
                                });
                                const ranks = sortedList.map(function(item) {
                                    return item.elorank;
                                });
                                for (var i = 0; i < listOfUserInfo.length; i++) {
                                    listOfUserInfo[i].rank = ranks.indexOf(listOfUserInfo[i].elorank) + 1;
                                }
                                resolve(JSON.stringify(listOfUserInfo));
                            }
                            count++;
                        });
                    });
                }));
            }
        });
        updateLobbyActiveGames();
    });
}

function getRecord(user) {
    if (user.data.dbId) {
        db.find(user.data.dbId).then(function(resp) {
            user.data.winLossRecord.wins = resp.wins;
            user.data.winLossRecord.loses = resp.loses;
            user.data.elorank = resp.elorank;
            getLobbyUserInfo().then(function(listOfUserInfo) {
                cloak.messageAll('updateusers', listOfUserInfo);
            });
        });
    }
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
module.exports.getRecord = getRecord;
