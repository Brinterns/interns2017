import React, { Component } from 'react';
import User from '../user/User';
import config from '../config/config';

export default class Lobby extends Component {
  constructor(props){
    super(props);
    this.state = {
      listOfUserNames : ['Bob','Sam','Daniel']
    };
    cloak.configure({
      messages: {
      updateusers: function(userlist) {
        }
      },
    });
  }
  render() {
      const userList = (
        this.state.listOfUserNames.map(function(users,i){
          return <User index={i} key={i} name={users} />;
        })
      );
      return (
        <div>
          {userList}
        </div>
      );
  }
};
