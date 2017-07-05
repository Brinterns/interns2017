import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import gameStyles from './Game.css';

export default class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
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
        cloak.message('getroominfo', _);
    }

    render() {
        const gameOverTextChoice = (this.state.winnerId == this.state.id) ? "You Won!" : "You Lost";
        const gameOverDiv = (
                <div>
                    <h1>{gameOverTextChoice}</h1>
                    <button onClick={this.returnToLobby}> Return To Lobby </button>
                </div>
        );
        const forfeitDiv = (
            <div>
                <h1>Are you sure you want to forfeit?</h1>
                <button onClick={this.onClickForfeit}>No</button>
                <button onClick={() => this.onClickWin(false)}>Yes</button>
            </div>
        );

        return (
            <div>
                <center>
                    <button className={gameStyles.forfeitButton} onClick={this.onClickForfeit}> FORFEIT </button>
                    <h1> The Royal Game of Clicking </h1>
                    <button onClick={() => this.onClickWin(true)}> PRESS ME </button>
                    {this.state.GameOver ? gameOverDiv : null}
                    {this.state.forfeit ? forfeitDiv : null}
                </center>
            </div>
        );
    }
}
