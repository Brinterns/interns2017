import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import styles from './Login.css';
import { connect } from 'react-redux';

import { updateUsername } from './Login-actions';
import { RunCloakConfig } from '../services/cloak-service';

export class Login extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        {this.isUser()};
    }

    reconnectWait() {
        setTimeout(() => {
            if (cloak.connected()) {
                const dbId = localStorage.getItem('dbId');
                if (dbId) {
                    cloak.message('previoususer', dbId);
                }
            } else {
                this.reconnectWait();
            }
        }, 100);
    }

    isUser() {
        RunCloakConfig();
        if(cloak.connected()) {
            const dbId = localStorage.getItem('dbId');
            if (dbId) {
                cloak.message('previoususer', dbId);
            }
        } else {
            this.reconnectWait();
        }
    }

    handleChange(event) {
        this.props.updateUsername(event.target.value);
    }

    onSubmit() {
        cloak.message('setusername', this.props.username);
        browserHistory.push("/lobby");
    }

    render() {
        return (
            <div className={styles.pageBackground}>
                <h1> The Royal Game of Ur </h1>
                <div className={styles.backgroundBlock}>
                    <div className={styles.inputbox}>
                        <form onSubmit={this.onSubmit}>
                            <input className={styles.nameField}  type="text" placeholder="Username" value={this.props.username} onChange={this.handleChange}/>
                            <input className={styles.submitButton} type="submit" value="Submit"/>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    username: state.login.username
});

const mapDispatchToProps = dispatch => ({
    updateUsername(username) {
        dispatch(updateUsername(username));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
