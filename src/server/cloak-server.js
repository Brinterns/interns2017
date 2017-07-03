var cloak = require('cloak');

let listOfUsers = [];

var updateLobbyUsers = function(arg) {
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
