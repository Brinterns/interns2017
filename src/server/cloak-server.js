var cloak = require('cloak');

var listOfUserNames = [];

var sendLobbyCount = function(arg) {
  listOfUserNames = [];
  var members = this.getMembers();
  members.forEach( function(user) {
    listOfUserNames.push(user.name);
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
