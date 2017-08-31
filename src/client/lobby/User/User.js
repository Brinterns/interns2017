import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import {emojify} from 'react-emojione';
import ChallengeOptions from '../../components/ChallengeOptions.js';
import userStyles from '../Lobby.css';

export default class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numberOfPieces: 7,
            enablePowerUps: false,
            alternatePath: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.togglePowerUps = this.togglePowerUps.bind(this);
        this.togglePath = this.togglePath.bind(this);
    }

    handleChange(numberOfPieces) {
        this.setState({
            numberOfPieces: numberOfPieces
        });
    }

    togglePowerUps() {
        this.setState({
            enablePowerUps: !this.state.enablePowerUps
        });
    }

    togglePath() {
        this.setState({
            alternatePath: !this.state.alternatePath
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
                    <ChallengeOptions lobby={true} inChallenge={true} challengePieces={this.props.challenging.numberOfPieces} challengePowerUps={this.props.challenging.enablePowerUps} challengeAlternatePath={this.props.challenging.alternatePath} />
                </div>;
        } else if (this.props.challenger) {
            challengeButtons =
                <div className={userStyles.buttonDiv}>
                    <div className={userStyles.buttonHolder}>
                        <button className={userStyles.declineButton} onClick={() => {this.props.challengeRespond(false, this.props.user.id)}}> &#x2716; </button>
                        <button className={userStyles.acceptButton} onClick={() => {this.props.challengeRespond(true, this.props.user.id)}}> &#10004; </button>
                    </div>
                    <ChallengeOptions lobby={true} inChallenge={true} challengePieces={this.props.challenger.numberOfPieces} challengePowerUps={this.props.challenger.enablePowerUps} challengeAlternatePath={this.props.challenger.alternatePath} />
                </div>;
        } else {
            challengeButtons =
                <div className={userStyles.buttonDiv}>
                    <button onClick={() => {this.props.challengeUser(this.props.user.id, this.state.numberOfPieces, this.state.enablePowerUps, this.state.alternatePath)}}> Challenge </button>
                    <ChallengeOptions lobby={true} inChallenge={false} numberOfPieces={this.state.numberOfPieces} enablePowerUps={this.state.enablePowerUps} alternatePath={this.state.alternatePath} onChange={this.handleChange} togglePowerUps={this.togglePowerUps} togglePath={this.togglePath} />
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
