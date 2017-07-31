import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import loginStyles from './Login.css';
import { connect } from 'react-redux';
import { updateUsername } from './Login-actions';
import { RunCloakConfig } from '../services/cloak-service';
import logo from '../images/logo.png';
import DrawCanvas from '../components/DrawCanvas';

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
                cloak.message('previoususer', [localStorage.getItem('dbId'), localStorage.getItem('userId')]);
            } else {
                this.reconnectWait();
            }
        }, 100);
    }

    isUser() {
        RunCloakConfig();
        if(cloak.connected()) {
            cloak.message('previoususer', [localStorage.getItem('dbId'), localStorage.getItem('userId')]);
        } else {
            this.reconnectWait();
        }
    }
    handleChange(event) {
        if (event.target.value.length <= 14) {
            this.props.updateUsername(event.target.value);
        }
    }

    onSubmit() {
        cloak.message('setusername', this.props.username);
        cloak.message('setavatar', this.refs.sketcher.refs.drawCanvas.toDataURL());
        browserHistory.push("/lobby");
    }

    render() {
        return (
            <div className={loginStyles.pageBackground}>
                <div className={loginStyles.gameTitle}>
                    <img src={logo} />
                    <h1> The Royal Game of Ur </h1>
                </div>
                <div className={loginStyles.backgroundBlock}>
                    <div className={loginStyles.inputbox}>
                        <DrawCanvas ref="sketcher" canvasClassName={loginStyles.canvas} sketcherClassName={loginStyles.drawingCanvas}/>
                        <form onSubmit={this.onSubmit}>
                            <input className={loginStyles.nameField}  type="text" placeholder="Username" value={this.props.username} onChange={this.handleChange}/>
                            <input className={loginStyles.submitButton} type="submit" value="Submit"/>
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
