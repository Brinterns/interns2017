import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import User from './User';
import lobbyStyles from './Lobby.css';
import ChatBox from './Chat/ChatBox';
import Rules from '../rules/Rules';

import {
    updateMessages,
    updateId,
    updateRoomNames,
    updateUsers} from './Lobby-actions';

export class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rules: false
        };
        cloak.configure({
            messages: {
                updateusers: (userInfo) => {
                    if (!this.props.id) {
                        return;
                    }
                    const info = JSON.parse(userInfo);
                    const ready = info.filter((user) => {
                        return user.id === this.props.id;
                    })[0].ready;
                    this.props.updateUsers(info, ready);
                },
                updaterooms: (roomNames) => {
                    this.props.updateRoomNames(roomNames);
                },
                userid: (id) => {
                    this.props.updateId(id);
                },
                joingame: (roomId) => {
                    browserHistory.push('/game/' + roomId);
                },
                updatemessages: (messages) => {
                    this.props.updateMessages(JSON.parse(messages));
                }
            }
        });
        this.onClick = this.onClick.bind(this);
        this.challengeUser = this.challengeUser.bind(this);
        this.handleToggleRules = this.handleToggleRules.bind(this);
        {this.getLobbyInfo()};
    }

    onClick(e) {
        cloak.message('userready', _);
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

    handleToggleRules() {
        this.setState({
            rules: !this.state.rules
        });
    }

    render() {
        let otherUsers = [];
        let name = "";
        this.props.listOfUsers.forEach((user) => {
            if (this.props.id != user.id) {
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
            this.props.listOfActiveGames.map((gameName, i) => {
                return <h2 key={i}>{gameName}</h2>;
            })
        );
        const buttonClass = this.props.ready ? lobbyStyles.unready : null;

        return (
            <div className={lobbyStyles.lobbyMain}>
                <h1> {name} </h1>
                <div className={lobbyStyles.readyOptions}>
                    <button className={buttonClass} onClick={this.onClick}>{this.props.ready ? "Unready" : "Ready"}</button>
                </div>
                <button className={lobbyStyles.rules} onClick={this.handleToggleRules}> Rules </button>
                <div className="container">
                    <div className ={lobbyStyles.userList}>
                        <h1>Lobby</h1>
                        {userDisplayList}
                    </div>
                    <div className ={lobbyStyles.gameList}>
                        <h1>Active Games</h1>
                        {gamesDisplayList}
                    </div>
                    <ChatBox id={this.props.id} messages={this.props.messages}/>
                </div>
                {this.state.rules ? <Rules toggleRules={this.handleToggleRules} /> : null}
            </div>
        );
    }
};

const mapStateToProps = state => ({
    id: state.lobby.id,
    listOfUsers: state.lobby.listOfUsers,
    ready: state.lobby.ready,
    listOfActiveGames: state.lobby.listOfActiveGames,
    messages: state.lobby.messages
});

const mapDispatchToProps = dispatch => ({
    updateMessages(messages) {
        dispatch(updateMessages(messages));
    },
    updateId(id) {
        dispatch(updateId(id));
    },
    updateRoomNames(roomNames) {
        dispatch(updateRoomNames(roomNames));
    },
    updateUsers(listOfUsers, ready) {
        dispatch(updateUsers(listOfUsers, ready));
    }
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Lobby);
