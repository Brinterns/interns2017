import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import loginStyles from './Login.css';
import { connect } from 'react-redux';
import { updateUsername } from './Login-actions';
import { RunCloakConfig } from '../services/cloak-service';
import {SketchField, Tools} from 'react-sketch';
import logo from '../images/logo.png';
import bin from '../images/icons/bin.png';
import redo from '../images/icons/redo.png';
import undo from '../images/icons/undo.png';

export class Login extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.undoImg = this.undoImg.bind(this);
        this.redoImg = this.redoImg.bind(this);
        this.clearImg = this.clearImg.bind(this);
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

    clearImg() {
        this._sketch.clear();
    }

    undoImg() {
        this._sketch.undo();
    }

    redoImg() {
        this._sketch.redo();
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
        cloak.message('setavatar', this._sketch.toDataURL());

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
                        <img onClick={this.clearImg} src={bin}/>
                        <img onClick={this.undoImg} src={undo}/>
                        <img onClick={this.redoImg} src={redo}/>
                        <div  className={loginStyles.canvas}>
                            <SketchField
                            className={loginStyles.drawingCanvas}
                             ref={(c) => this._sketch = c}
                             tool={Tools.Pencil}
                             lineColor='black'
                             lineWidth={3}/>
                        </div>
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
