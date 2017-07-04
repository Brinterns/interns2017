import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import userStyles from '../Lobby.css';


export default class User extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={userStyles.user}>
                <div>
                    <h1>{this.props.name}</h1>
                </div>
            </div>
        );
    }
}
