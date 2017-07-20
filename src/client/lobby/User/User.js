import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import userStyles from '../Lobby.css';


export default class User extends Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    
    onClick() {
        if (this.props.user.ready) {
            this.props.challengeUser(this.props.user);
        }
    }

    render() {
        const buttonClassname = (!this.props.user.ready || !this.props.canChallenge) ? userStyles.inactiveChallenge : null;
        return (
            <div className={userStyles.user}>
                <h1> {this.props.user.name} </h1>
                <h2> W: {this.props.user.winLossRecord.wins} L: {this.props.user.winLossRecord.loses} </h2>
                <div className = {userStyles.challengeButton}>
                    <button className={buttonClassname} onClick={this.onClick}>Challenge</button>
                </div>
            </div>
        );
    }
}
