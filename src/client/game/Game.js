import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import gameStyles from './Game.css';

export default class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            roomname: '',
            listOfPlayers: [],
            GameOver : false,
            forfeit: false,
            winnerId: null
        };
        cloak.configure({
            messages: {
                updateplayers: (userinfo) => {
                    this.setState({
                        listOfPlayers: JSON.parse(userinfo)
                    });
                },
                userid: (id) => {
                    this.setState({
                        id: id
                    });
                    localStorage.setItem('userId', id);
                },
                roomname: (name) => {
                    this.setState({
                        roomname: name
                    });
                },
                gameover: (winnerId) => {
                    this.setState({
                        forfeit: false,
                        winnerId: winnerId,
                        GameOver: true
                    });
                },
                gotolobby: () => {
                    browserHistory.push('/lobby');
                }
            }
        });
        this.onClickWin = this.onClickWin.bind(this);
        this.onClickForfeit = this.onClickForfeit.bind(this);
        this.returnToLobby = this.returnToLobby.bind(this);
        {this.getGameInfo()};
    }

    onClickWin(winBool) {
        if (this.state.GameOver) {
            return;
        }
        cloak.message('winclick', winBool);
    }

    onClickForfeit() {
        if (this.state.GameOver) {
            return;
        }
        const forfeitAttempt = this.state.forfeit;
        this.setState({
            forfeit: !forfeitAttempt
        });
    }

    returnToLobby() {
        cloak.message('leavegame', _);
    }

    getGameInfo() {
        if(cloak.connected()) {
            cloak.message('getroominfo', _);
        } else {
            setTimeout(() => {
                cloak.message('reconnectuser', localStorage.getItem('userId'));
                cloak.message('getroominfo', _);
            }, 300);
        }
    }

    render() {
        const gameOverTextChoice = (this.state.winnerId == this.state.id) ? "You Won!" : "You Lost";
        const gameOverDiv = (
            <div className={gameStyles.notificationMenu}>
                <h1>{gameOverTextChoice}</h1>
                <button className={gameStyles.returnButton} onClick={this.returnToLobby}> Return To Lobby </button>
            </div>
        );
        const forfeitDiv = (
            <div className={gameStyles.notificationMenu}>
                <h1>Are you sure you want to forfeit?</h1>
                <button className={gameStyles.yesButton} onClick={() => this.onClickWin(false)}>Yes</button>
                <button className={gameStyles.noButton} onClick={this.onClickForfeit}>No</button>
            </div>
        );

        return (
            <div className={gameStyles.gameMain}>
                <button className={gameStyles.forfeitButton} onClick={this.onClickForfeit}> FORFEIT </button>
                <h1> {this.state.roomname} </h1>
                <div>
                    <button className={gameStyles.winButton} onClick={() => this.onClickWin(true)}> PRESS ME </button>
                </div>
                {this.state.GameOver ? gameOverDiv : null}
                {this.state.forfeit ? forfeitDiv : null}
            </div>
        );
    }
}
