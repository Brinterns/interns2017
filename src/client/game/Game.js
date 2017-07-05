import React, { Component } from 'react';

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
                }
            }
        });
        this.onClickWin = this.onClickWin.bind(this);
        this.onClickForfeit = this.onClickForfeit.bind(this);
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

    getGameInfo() {
        cloak.message('getroominfo', _);
    }

    render() {
        const gameOverTextChoice = (this.state.winnerId == this.state.id) ? "You Won!" : "You Lost";
        const gameOverDiv = (
                <div>
                    <h1>{gameOverTextChoice}</h1>
                    <button> Return To Lobby </button>
                </div>
        );
        const forfeitDiv = (
            <div>
                <h1>Are you sure you want to forfeit?</h1>
                <button onClick={this.onClickForfeit}>No</button>
                <button onClick={ () => this.onClickWin(false)}>Yes</button>
            </div>
        );

        return (
            <div>
                <center>
                    <h1> The Royal Game of Clicking </h1>
                    <button onClick={ () => this.onClickWin(true)}> PRESS ME </button>
                    <button onClick={this.onClickForfeit}> FORFEIT </button>
                    {this.state.GameOver ? gameOverDiv : null}
                    {this.state.forfeit ? forfeitDiv : null}
                </center>
            </div>
        );
    }
}
