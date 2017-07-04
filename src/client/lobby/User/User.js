import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import userStyles from '../Lobby.css';


export default class User extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const buttonClassname = this.props.ready ? null : userStyles.inactiveChallenge;
        return (
            <div className={userStyles.user}>
                <h1>{this.props.name}</h1>
                <div className = {userStyles.challengeButton}>
                    <button className={buttonClassname}>Challenge</button>
                </div>
            </div>
        );
    }
}
