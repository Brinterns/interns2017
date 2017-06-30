var cloak = require('cloak');

let listOfUsers = [];

var sendLobbyCount = function(arg) {
  listOfUsers = [];
  var members = this.getMembers();
  members.forEach( function(user) {
    listOfUsers.push(user);
  });
};

module.exports = function(expressServer) {
    cloak.configure({
        express: expressServer,
        messages: {
          setusername: function(msg, user) {
            user.name = msg;
          }
        },
        lobby: {
          newMember: sendLobbyCount,
          memberLeaves: sendLobbyCount
        }
    });
    cloak.run();
};
