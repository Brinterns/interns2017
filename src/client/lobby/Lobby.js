import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import User from './User';
import lobbyStyles from './Lobby.css';
import ChatBox from './Chat/ChatBox';

export default class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            listOfUsers: [],
            listOfActiveGames: [],
            messages: [],
            ready: false
        };
        cloak.configure({
            messages: {
                updateusers: (userInfo) => {
                    this.setState({
                        listOfUsers: JSON.parse(userInfo)
                    });
                },
                updaterooms: (roomNames) => {
                    this.setState({
                        listOfActiveGames: roomNames
                    });
                },
                userid: (id) => {
                    this.setState({
                        id: id
                    });
                    localStorage.setItem('userId', id);
                },
                joingame: (roomId) => {
                    browserHistory.push('/game/' + roomId);
                },
                updatemessages: (messages) => {
                    this.setState({
                        messages: JSON.parse(messages)
                    });
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
                cloak.message('reconnectuser', localStorage.getItem('userId'));
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
        const gamesDisplayList = (
            this.state.listOfActiveGames.map((gameName, i) => {
                return <h2 key={i}>{gameName}</h2>;
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
                        <h1>Lobby</h1>
                        {userDisplayList}
                    </div>
                    <div className ={lobbyStyles.gameList}>
                        <h1>Active Games</h1>
                        {gamesDisplayList}
                    </div>
                    <ChatBox id={this.state.id} messages={this.state.messages}/>
                </div>
            </div>
        );
    }
};
