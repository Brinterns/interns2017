import React, { Component } from 'react';
import User from '../user/User';
import config from '../config/config';

export default class Lobby extends Component {
  constructor(props){
    super(props);
    this.state = {
      listOfUserNames : []
    };
    cloak.configure({
      messages: {
      updateusers: (userlistInput) => {
          this.setState({
            listOfUserNames : userlistInput
          });
        }
      },
    });
    {this.getUserNames()};
  }

  getUserNames(){
    cloak.message('getusernames',_);
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
