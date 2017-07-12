import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import gameStyles from './Game.css';
import Board from './board/Board';

const numberOfPieces = 7;

export default class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            roomname: '',
            listOfPlayers: [],
            GameOver : false,
            forfeit: false,
            winnerId: null,
            currentPlayer: null,
            rollNumber: 'Roll',
            opponentRollNumber: null,
            rolled: false,
            moveablePositions: [],
            squares: Array(24).fill(false),
            piecePositions: Array(numberOfPieces).fill(0),
            numPiecesFinished: 0
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
                },
                currentplayer: (current) => {
                    this.setState({
                        currentPlayer: current,
                        rolled: false,
                        opponentRollNumber: null
                    });
                    if (this.state.currentPlayer === this.state.id) {
                        this.setState({
                            rollNumber: 'Roll'
                        });
                    }
                },
                rolledvalue: (value) => {
                    this.setState({
                        rollNumber: value
                    });
                },
                opponentroll: (value) => {
                    this.setState({
                        opponentRollNumber: value
                    });
                },
                moveablepositions: (moveablePositions) => {
                    this.setState({
                        moveablePositions: moveablePositions
                    });
                },
                piecepositions: (positions) => {
                    this.setState({
                        piecePositions: positions
                    });
                },
                squarestates: (squares) => {
                    this.setState({
                        squares: squares
                    });
                },
                finishedpieces: (numPiecesFinished) => {
                    this.setState({
                        numPiecesFinished: numPiecesFinished
                    });
                }
            }
        });
        this.onWin = this.onWin.bind(this);
        this.onClickForfeit = this.onClickForfeit.bind(this);
        this.returnToLobby = this.returnToLobby.bind(this);
        this.rolledCb = this.rolledCb.bind(this);
        {this.getGameInfo()};
    }

    onWin(winBool) {
        if (this.state.GameOver) {
            return;
        }
        cloak.message('win', winBool);
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

    rolledCb() {
        this.setState({
            rolled: true
        });
    }

    render() {
        const isPlayerTurn = (this.state.currentPlayer === this.state.id);
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
                <button className={gameStyles.yesButton} onClick={() => this.onWin(false)}>Yes</button>
                <button className={gameStyles.noButton} onClick={this.onClickForfeit}>No</button>
            </div>
        );
        let currentPlayerText = "";
        let opponentRoll = "";
        if (this.state.listOfPlayers.length) {
            currentPlayerText = isPlayerTurn ? "It's your turn" : "It's " + this.state.listOfPlayers.filter(player => {
                return player.id === this.state.currentPlayer;
            })[0].name + "'s" + " turn";
            if (this.state.opponentRollNumber) {
                opponentRoll = this.state.listOfPlayers.filter(player => {
                    return player.id === this.state.currentPlayer;
                })[0].name + " rolled a " + this.state.opponentRollNumber;
            }
        }

        return (
            <div className={gameStyles.gameMain}>
                <h2> {currentPlayerText} </h2>
                <button className={gameStyles.forfeitButton} onClick={this.onClickForfeit}> FORFEIT </button>
                <h1> {this.state.roomname} </h1>
                <h4> {opponentRoll} </h4>
                <Board numPiecesFinished={this.state.numPiecesFinished} squares={this.state.squares} piecePositions={this.state.piecePositions} onWin={this.onWin} isPlayerTurn={isPlayerTurn} rollNumber={this.state.rollNumber} rolled={this.state.rolled} rolledCb={this.rolledCb} moveablePositions={this.state.moveablePositions}/>
                {this.state.GameOver ? gameOverDiv : null}
                {this.state.forfeit ? forfeitDiv : null}
            </div>
        );
    }
}
