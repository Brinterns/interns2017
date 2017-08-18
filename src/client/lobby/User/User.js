import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import {emojify} from 'react-emojione';
import userStyles from '../Lobby.css';
import powerup from '../../images/powerups/pushinactive.png';
import powerupactive from '../../images/powerups/push.png';

export default class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numberOfPieces: 7,
            powerUps: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.togglePowerUps = this.togglePowerUps.bind(this);
    }

    handleChange(event) {
        if ((event.target.id === "minus") && (this.state.numberOfPieces > 1)) {
            this.setState({
                numberOfPieces: this.state.numberOfPieces - 1
            });
        } else if ((event.target.id === "plus") && (this.state.numberOfPieces < 9)) {
            this.setState({
                numberOfPieces: this.state.numberOfPieces + 1
            });
        }
    }

    togglePowerUps() {
        this.setState({
            powerUps: !this.state.powerUps
        });
    }

    render() {
        const canvasId = "useravatar" + this.props.index;
        if (this.props.user.avatar) {
            var myCanvas = document.getElementById(canvasId);
            if (myCanvas) {
                setTimeout (() => {
                    var ctx = myCanvas.getContext('2d');
                    ctx.clearRect(0,0,myCanvas.width, myCanvas.height);
                    var img = new Image;
                    img.onload = function(){
                      ctx.drawImage(img, 0, 0, 300, 150);
                    };
                    img.src = this.props.user.avatar;
                }, 50);
            }
        }
        var challengeButtons;
        if (!this.props.user.inLobby || this.props.user.isMe) {
            challengeButtons = null;
        } else if (this.props.challenging) {
            challengeButtons =
                <div className={userStyles.buttonDiv}>
                    <button onClick={() => {this.props.cancelChallenge(this.props.user.id)}}> Cancel </button>
                    <div className={userStyles.numberOfPieces}>
                        <label title="No. of pieces" className={userStyles.numberOfPiecesInactive}> <p>{this.props.challenging.numberOfPieces}</p> </label>
                        {this.props.challenging.powerUps ? <img title="Power Ups Disabled" src={powerupactive} /> : <img title="Power Ups Enabled" src={powerup} />}
                    </div>
                </div>;
        } else if (this.props.challenger) {
            challengeButtons =
                <div className={userStyles.buttonDiv}>
                    <div className={userStyles.buttonHolder}>
                        <button className={userStyles.declineButton} onClick={() => {this.props.challengeRespond(false, this.props.user.id)}}> &#x2716; </button>
                        <button className={userStyles.acceptButton} onClick={() => {this.props.challengeRespond(true, this.props.user.id)}}> &#10004; </button>
                    </div>
                    <div className={userStyles.numberOfPieces}>
                        <label title="No. of pieces" className={userStyles.numberOfPiecesInactive}> <p>{this.props.challenger.numberOfPieces}</p> </label>
                        {this.props.challenger.powerUps ? <img title="Power Ups Disabled" src={powerupactive} /> : <img title="Power Ups Enabled" src={powerup} />}
                    </div>
                </div>;
        } else {
            challengeButtons =
                <div className={userStyles.buttonDiv}>
                    <button onClick={() => {this.props.challengeUser(this.props.user.id, this.state.numberOfPieces, this.state.powerUps)}}> Challenge </button>
                    <div className={userStyles.numberOfPieces}>
                        <label title="No. of pieces"> <p>{this.state.numberOfPieces}</p> </label>
                        <div>
                            <button id="plus" title="Increase no. of pieces" onClick={this.handleChange}> + </button>
                            <button id="minus" title="Decrease no. of pieces" className={userStyles.numberOfPiecesMinus} onClick={this.handleChange}> - </button>
                        </div>
                        {this.state.powerUps ? <img title="Disable Power Ups" className={userStyles.powerUpClickable} src={powerupactive} onClick={this.togglePowerUps} /> : <img title="Enable Power Ups" className={userStyles.powerUpClickable} src={powerup} onClick={this.togglePowerUps} />}
                    </div>
                </div>;
        }
        var displayName = this.props.user.name;
        if (!this.props.user.online) {
            displayName += " (Offline)";
        } else if (this.props.user.spectating) {
            displayName += " (Spectating)";
        } else if (!this.props.user.inLobby) {
            displayName += " (In-Game)";
        } else if (this.props.user.isMe) {
            displayName += " (You)";
        }
        return (
            <div className={this.props.user.online ? userStyles.onlineBackground : userStyles.offlineBackground}>
                <div className={userStyles.user}>
                    <div className={this.props.user.inLobby ? userStyles.userDetails : userStyles.userDetailsFull}>
                        <canvas id={canvasId} className={userStyles.canvasOther}/>
                        <div className={userStyles.userDetailsText}>
                            <h1> {emojify(displayName)} </h1>
                            <h2> Rating: {this.props.user.elorank} #{this.props.user.rank} </h2>
                            <h2> W: {this.props.user.winLossRecord.wins} L: {this.props.user.winLossRecord.loses} </h2>
                        </div>
                    </div>
                    {challengeButtons}
                </div>
            </div>
        );
    }
}
