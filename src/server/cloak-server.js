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
  messageAllUserNames();
};
//all clients are updated with the list of usernames currently in the lobby
function messageAllUserNames(){
  let listofUserNames = [];
  listOfUsers.forEach(function(user){
    listofUserNames.push(user.name);
  });
  cloak.messageAll('updateusers', listofUserNames);
}

module.exports = function(expressServer) {
    cloak.configure({
        express: expressServer,
        messages: {
          setusername: function(msg, user) {
            listOfUsers[listOfUsers.indexOf(user)].name = msg;
            user.name = msg;
            messageAllUserNames();
          },
          getusernames: function(msg, user) {
            user.message('updateusers',listOfUserNames);
          }
        },
        lobby: {
          newMember: updateLobbyUsers,
          memberLeaves: updateLobbyUsers
        }
    });
    cloak.run();
};
