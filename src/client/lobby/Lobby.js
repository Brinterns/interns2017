import React, { Component } from 'react';
import User from './User';
import config from '../config/config';

import lobbyStyles from './Lobby.css';

export default class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            listOfUsers: [],
            ready: false
        };
        cloak.configure({
            messages: {
                updateusers: (userInfo) => {
                    this.setState({
                        listOfUsers: JSON.parse(userInfo)
                    });
                },
                userid: (id) => {
                    this.setState({
                        id: id
                    });
                }
            }
        });
        this.onClick = this.onClick.bind(this);
        {this.getLobbyInfo()};
    }

    onClick(e) {
        const ready = !this.state.ready;
        cloak.message('userready', ready);
        this.setState({
            ready: ready
        });
    }

    getLobbyInfo() {
        cloak.message('getlobbyinfo',_);
    }

    render() {
        let otherUsers = [];
        let name = "";
        this.state.listOfUsers.forEach((user) => {
            if (this.state.id != user.id) {
                otherUsers.push(user.name);
                return;
            }
            name = user.name;
        });

        const userDisplayList = (
            otherUsers.map(function(users, i) {
                return <User key={i} name={users} />;
            })
        );
        return (
            <div className={lobbyStyles.lobbyMain}>
                <h1> {name} </h1>
                <button onClick={this.onClick} className={lobbyStyles.readyButton}>{this.state.ready ? "Unready" : "Ready"}</button>
                <div className="container">
                    <div className ={lobbyStyles.userList}>
                        {userDisplayList}
                    </div>
                </div> 
            </div>
        );
    }
};
