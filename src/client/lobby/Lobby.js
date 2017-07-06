import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import User from './User';
import Cookies from 'universal-cookie';
import lobbyStyles from './Lobby.css';

const cookies = new Cookies();

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
                    console.log("I have been told my id = " + id);
                    this.setState({
                        id: id
                    });
                    cookies.set('userId', id);
                },
                joingame: (roomId) => {
                    browserHistory.push('/game/' + roomId);
                }
            }
        });
        this.onClick = this.onClick.bind(this);
        this.challengeUser = this.challengeUser.bind(this);
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
        if(cloak.connected()) {
            cloak.message('getlobbyinfo', _);
        } else {
            setTimeout(() => {
                cloak.message('reconnectuser', cookies.get('userId'));
            }, 300);
        }
    }

    challengeUser(user) {
        cloak.message('creategame', user.id);
    }

    render() {
        let otherUsers = [];
        let name = "";
        this.state.listOfUsers.forEach((user) => {
            if (this.state.id != user.id) {
                otherUsers.push(user);
                return;
            }
            name = user.name;
        });

        const userDisplayList = (
            otherUsers.map((user, i) => {
                return <User key={i} user={user} challengeUser={this.challengeUser} />;
            })
        );
        const buttonClass = this.state.ready ? lobbyStyles.unready : null;
        return (
            <div className={lobbyStyles.lobbyMain}>
                <h1> {name} </h1>
                <div className={lobbyStyles.readyOptions}>
                    <button onClick={this.onClick} className={buttonClass}>{this.state.ready ? "Unready" : "Ready"}</button>
                </div>
                <div className="container">
                    <div className ={lobbyStyles.userList}>
                        {userDisplayList}
                    </div>
                </div>
            </div>
        );
    }
};
