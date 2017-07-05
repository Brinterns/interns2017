import React, { Component } from 'react';
import { browserHistory } from 'react-router';

export default class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            listOfPlayers: [],
            GameOver : false,
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
        {this.getGameInfo()};
    }

    onClickWin(winBool) {
        if (this.state.GameOver) {
            return;
        }
        cloak.message('winclick', winBool);
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

        return (
            <div>
                <center>
                    <h1> The Royal Game of Clicking </h1>
                    <button onClick={ () => this.onClickWin(true)}> PRESS ME </button>
                    <button onClick={ () => this.onClickWin(false)}> FORFEIT </button>
                    {this.state.GameOver ? gameOverDiv : null}
                </center>
            </div>
        );
    }
}
