import React, { Component } from 'react';
import User from './User';
import config from '../config/config';

export default class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOfUserNames : [],
      ready: false
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
    this.onClick = this.onClick.bind(this);
    {this.getUserNames()};
  }

  onClick(e) {
    const ready = !this.state.ready;
    cloak.message('userready', ready);
    this.setState({
      ready: ready
    });
  }

  getUserNames() {
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
        <button onClick={this.onClick}>{this.state.ready ? "Unready" : "Ready"}</button>
        {userList}
      </div>
    );
  }
};
