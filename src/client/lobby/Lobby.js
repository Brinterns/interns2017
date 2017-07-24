import React, { Component } from 'react';
import { connect } from 'react-redux';
import User from './User';
import lobbyStyles from './Lobby.css';
import ChatBox from './Chat/ChatBox';
import Rules from '../rules/Rules';

import { RunCloakConfig } from '../services/cloak-service';

export class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rules: false
        };
        this.onClick = this.onClick.bind(this);
        this.challengeUser = this.challengeUser.bind(this);
        this.cancelChallenge = this.cancelChallenge.bind(this);
        this.challengeRespond = this.challengeRespond.bind(this);
        this.handleToggleRules = this.handleToggleRules.bind(this);
        {this.getLobbyInfo()};
    }

    onClick(e) {
        if (!(this.props.challenger || this.props.challenging)) {
            cloak.message('userready', _);
        }
    }

    reconnectWait() {
        setTimeout(() => {
            if (cloak.connected()) {
                cloak.message('reconnectuser', localStorage.getItem('userId'));
            } else {
                this.reconnectWait();
            }
        }, 300);
    }

    getLobbyInfo() {
        RunCloakConfig();
        if(cloak.connected()) {
            const dbId = localStorage.getItem('dbId');
            cloak.message('getlobbyinfo', dbId);
        } else {
            this.reconnectWait();
        }
    }

    challengeUser(user) {
        if (!(this.props.challenger || this.props.challenging)) {
            cloak.message('challengeplayer', user.id);
        }
    }

    cancelChallenge() {
        cloak.message('cancelchallenge', _);
    }

    challengeRespond(accept) {
        cloak.message('challengerespond', accept);
    }

    handleToggleRules() {
        this.setState({
            rules: !this.state.rules
        });
    }

    render() {
        let otherUsers = [];
        let name = '';
        this.props.listOfUsers.forEach((user) => {
            if (this.props.id != user.id) {
                otherUsers.push(user);
                return;
            }
            name = user.name;
        });

        const userDisplayList = (
            otherUsers.map((user, i) => {
                const canChallenge = this.props.challenging || ((this.props.challenger === null) ? true : false);
                return <User key={i} user={user} canChallenge={canChallenge} challengeUser={this.challengeUser} />;
            })
        );
        const gamesDisplayList = (
            this.props.listOfActiveGames.map((gameName, i) => {
                return <h2 key={i}>{gameName}</h2>;
            })
        );
        const buttonClass = this.props.ready ? lobbyStyles.unready : null;

        let challengedDiv = null;
        if (this.props.challenger) {
            const opponent = this.props.listOfUsers.filter(user => {
                return user.id === this.props.challenger;
            })[0];
            if (opponent) {
                challengedDiv =
                    <div className={lobbyStyles.challengeMenu}>
                        <h1> {opponent.name} has challenged you </h1>
                        <button className={lobbyStyles.acceptButton} onClick={() => {this.challengeRespond(true)}}> Accept </button>
                        <button className={lobbyStyles.declineButton} onClick={() => {this.challengeRespond(false)}}> Decline </button>
                    </div>;
            }
        }
        let challengingDiv = null;
        if (this.props.challenging) {
            challengingDiv =
                <div className={lobbyStyles.challengeMenu}>
                    <h1> Waiting for response... </h1>
                    <button className={lobbyStyles.cancelButton} onClick={this.cancelChallenge}> Cancel </button>
                </div>;
        }

        return (
            <div className={lobbyStyles.lobbyMain}>
                <div className={lobbyStyles.userStats}>
                    <h1> {name} </h1>
                    {this.props.elorank ? <h2> Rank: {this.props.elorank} </h2>: null}
                    {this.props.winLossRecord ? <h2> Wins: {this.props.winLossRecord.wins} Loses: {this.props.winLossRecord.loses} </h2>: null}
                </div>
                <button className={lobbyStyles.rules} onClick={this.handleToggleRules}> Rules </button>
                <div className={lobbyStyles.container}>
                    <div className ={lobbyStyles.userList}>
                        <h1> Lobby </h1>
                        {userDisplayList}
                    </div>
                    <div className ={lobbyStyles.gameList}>
                        <h1> Active Games </h1>
                        {gamesDisplayList}
                    </div>
                    <ChatBox id={this.props.id} messages={this.props.messages}/>
                </div>
                <div className={lobbyStyles.readyOptions}>
                    <button className={buttonClass} onClick={this.onClick}>{this.props.ready ? 'Unready' : 'Ready'}</button>
                </div>
                {this.state.rules ? <Rules toggleRules={this.handleToggleRules} /> : null}
                {challengingDiv}
                {challengedDiv}
            </div>
        );
    }
};

const mapStateToProps = state => ({
    id: state.lobby.id,
    listOfUsers: state.lobby.listOfUsers,
    ready: state.lobby.ready,
    challenging: state.lobby.challenging,
    challenger: state.lobby.challenger,
    listOfActiveGames: state.lobby.listOfActiveGames,
    messages: state.lobby.messages,
    winLossRecord: state.lobby.winLossRecord,
    elorank: state.lobby.elorank
});

export default connect(
    mapStateToProps
)(Lobby);
