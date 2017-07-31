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
                var ctx = myCanvas.getContext('2d');
                var img = new Image;
                img.onload = function(){
                  ctx.drawImage(img, 0, 0, 300, 150);
                };
                img.src = this.props.user.avatar;
            }
        }
        var challengeButtons;
        if (this.props.challenging) {
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
        return (
            <div className={userStyles.user}>
                <div className={userStyles.userDetails}>
                    <canvas id={canvasId} className={userStyles.canvas}/>
                    <div className={userStyles.userDetailsText}>
                        <h1> {this.props.user.name} </h1>
                        <h2> Rating: {this.props.user.elorank} </h2>
                        <h2> W: {this.props.user.winLossRecord.wins} L: {this.props.user.winLossRecord.loses} </h2>
                    </div>
                </div>
                {challengeButtons}
            </div>
        );
    }
}
