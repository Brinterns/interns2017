var cloak = require('cloak');

let listOfUsers = [];

var updateLobbyUsers = function(arg) {
  listOfUsers = [];
  var members = this.getMembers();
  members.forEach( function(user) {
    listOfUsers.push(user.name);
  });
  cloak.messageAll('updateusers',listOfUsers);
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
          newMember: updateLobbyUsers,
          memberLeaves: updateLobbyUsers
        }
    });
    cloak.run();
};
