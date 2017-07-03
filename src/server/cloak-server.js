var cloak = require('cloak');

let listOfUsers = [];

//whenever a username is changed/a player joins the lobby/a player leaves the lobby
//the list of users is updated
var updateLobbyUsers = function(arg) {
  listOfUsers = [];
  var members = this.getMembers();
  members.forEach( function(user) {
    listOfUsers.push(user);
  });
  cloak.messageAll('updateusers', getListOfUserNames());
};

//all clients are updated with the list of usernames currently in the lobby
function getListOfUserNames(){
  let listofUserNames = [];
  listOfUsers.forEach(function(user){
    listofUserNames.push(user.name);
  });
  return listofUserNames;
}

module.exports = function(expressServer) {
  cloak.configure({
    express: expressServer,
    messages: {
      setusername: function(msg, user) {
        listOfUsers[listOfUsers.indexOf(user)].name = msg;
        user.name = msg;
        cloak.messageAll('updateusers', getListOfUserNames());
      },
      getusernames: function(msg, user) {
        user.message('updateusers', getListOfUserNames());
      },
      userready: function(msg, user) {
        user.data.ready = msg;
      }
    },
    lobby: {
      newMember: updateLobbyUsers,
      memberLeaves: updateLobbyUsers
    }
  });
  cloak.run();
};
