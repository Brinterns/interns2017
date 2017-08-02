import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import userStyles from '../Lobby.css';


export default class User extends Component {
    constructor(props) {
        super(props);
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
                },50);
            }
        }
        var challengeButtons;
        if (!this.props.user.inLobby) {
            challengeButtons = null;
        } else if (this.props.challenging) {
            challengeButtons =
                <div className={userStyles.buttonDiv}>
                    <button onClick={() => {this.props.cancelChallenge(this.props.user.id)}}> Cancel </button>
                </div>;
        } else if (this.props.challenged) {
            challengeButtons =
                <div className={userStyles.buttonDiv}>
                    <div className={userStyles.buttonHolder}>
                        <button className={userStyles.declineButton} onClick={() => {this.props.challengeRespond(false, this.props.user.id)}}> &#x2716; </button>
                        <button className={userStyles.acceptButton} onClick={() => {this.props.challengeRespond(true, this.props.user.id)}}> &#10004; </button>
                    </div>
                </div>;
        } else {
            challengeButtons =
                <div className={userStyles.buttonDiv}>
                    <button onClick={() => {this.props.challengeUser(this.props.user.id)}}> Challenge </button>
                </div>;
        }
        var displayName = this.props.user.name;
        if (!this.props.user.online) {
            displayName += " (Offline)";
        } else if (!this.props.user.inLobby) {
            displayName += " (In-Game)";
        }
        return (
            <div className={this.props.user.online ? userStyles.onlineBackground : userStyles.offlineBackground}>
                <div className={userStyles.user}>
                    <div className={this.props.user.inLobby ? userStyles.userDetails : userStyles.userDetailsFull}>
                        <canvas id={canvasId} className={userStyles.canvasOther}/>
                        <div className={userStyles.userDetailsText}>
                            <h1> {displayName} </h1>
                            <h2> Rating: {this.props.user.elorank} </h2>
                            <h2> W: {this.props.user.winLossRecord.wins} L: {this.props.user.winLossRecord.loses} </h2>
                        </div>
                    </div>
                    {challengeButtons}
                </div>
            </div>
        );
    }
}
