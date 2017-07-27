import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import userStyles from '../Lobby.css';


export default class User extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var challengeButtons;
        if (this.props.challenging) {
            challengeButtons =
                <div className={userStyles.buttonDiv}>
                    <button className={userStyles.cancelButton} onClick={() => {this.props.cancelChallenge(this.props.user.id)}}> Cancel </button>
                </div>;
        } else if (this.props.challenged) {
            challengeButtons =
                <div className={userStyles.buttonDiv}>
                    <button className={userStyles.declineButton} onClick={() => {this.props.challengeRespond(false, this.props.user.id)}}> &#x2716; </button>
                    <button className={userStyles.acceptButton} onClick={() => {this.props.challengeRespond(true, this.props.user.id)}}> &#10004; </button>
                </div>;
        } else {
            challengeButtons =
                <div className={userStyles.buttonDiv}>
                    <button onClick={() => {this.props.challengeUser(this.props.user.id)}}> Challenge </button>
                </div>;
        }

        return (
            <div className={userStyles.user}>
                <div className={userStyles.userDetails}>
                    <h1> {this.props.user.name} </h1>
                    <h2> Rating: {this.props.user.elorank} </h2>
                    <h2> W: {this.props.user.winLossRecord.wins} L: {this.props.user.winLossRecord.loses} </h2>
                </div>
                {challengeButtons}
            </div>
        );
    }
}
