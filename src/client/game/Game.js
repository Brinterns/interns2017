import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import gameStyles from './Game.css';
import Board from './board/Board';
import { connect } from 'react-redux';

import { RunCloakConfig } from '../services/cloak-service';

const numberOfPieces = 7;

import {
    toggleForfeit
} from './Game-actions';

export class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notificationBool: false,
            notificationText: null,
            winnerId: null,
            rollNumber: 'Roll',
            opponentRollNumber: null,
            moveablePositions: [],
            opponentSquares: Array(24).fill(false),
            piecePositions: Array(numberOfPieces).fill(0),
            numPiecesFinished: 0,
            numOppPiecesFinished: 0
        };
        cloak.configure({
            messages: {
                currentplayer: (current) => {

                    if (this.props.currentPlayer === this.props.id) {
                        this.setState({
                            rollNumber: 'Roll'
                        });
                        setTimeout(() => {
                            this.setState({
                                notificationBool: false
                            });
                        }, 1000);
                    }
                },
                opponentroll: (value) => {
                    this.setState({
                        opponentRollNumber: value,
                        notificationBool: true,
                        notificationText: this.props.listOfPlayers.filter(player => {
                            return player.id === this.props.currentPlayer;
                        })[0].name + " rolled a " + value
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
                opponentsquares: (squares) => {
                    this.setState({
                        opponentSquares: squares
                    });
                },
                finishedpieces: (numPiecesFinished) => {
                    this.setState({
                        numPiecesFinished: numPiecesFinished
                    });
                },
                finishedopppieces: (numPiecesFinished) => {
                    this.setState({
                        numOppPiecesFinished: numPiecesFinished
                    });
                },

            }
        });
        this.onWin = this.onWin.bind(this);
        this.onClickForfeit = this.onClickForfeit.bind(this);
        this.returnToLobby = this.returnToLobby.bind(this);
        {this.getGameInfo()};
    }

    onWin(winBool) {
        if (this.props.gameOver) {
            return;
        }
        cloak.message('win', winBool);
    }

    onClickForfeit() {
        if (this.props.gameOver) {
            return;
        }
        this.props.toggleForfeit();
    }

    returnToLobby() {
        cloak.message('leavegame', _);
    }

    getGameInfo() {
        RunCloakConfig();
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
        const isPlayerTurn = (this.props.currentPlayer === this.props.id);
        const gameOverTextChoice = (this.state.winnerId == this.props.id) ? "You Won!" : "You Lost";
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
        if (this.props.listOfPlayers.length) {
            currentPlayerText = isPlayerTurn ? "It's your turn" : "It's " + this.props.listOfPlayers.filter(player => {
                return player.id === this.props.currentPlayer;
            })[0].name + "'s" + " turn";
            if (this.state.opponentRollNumber !== null) {
                opponentRoll = this.state.notificationText;
            }
        }

        return (
            <div className={gameStyles.gameMain}>
                <h2> {currentPlayerText} </h2>
                <button className={gameStyles.forfeitButton} onClick={this.onClickForfeit}> FORFEIT </button>
                <h1> {this.props.roomName} </h1>
                <Board gameState={this.state} isPlayerTurn={isPlayerTurn}/>
                <div className={gameStyles.notificationDiv}>
                    {this.state.notificationBool ? opponentRoll : null}
                </div>
                {this.props.gameOver ? gameOverDiv : null}
                {this.props.forfeit ? forfeitDiv : null}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    roomName: state.game.roomName,
    id: state.game.id,
    listOfPlayers: state.game.listOfPlayers,
    currentPlayer: state.game.currentPlayer,
    gameOver: state.game.gameOver,
    forfeit: state.game.forfeit
});

const mapDispatchToProps = dispatch => ({
    toggleForfeit(){
        dispatch(toggleForfeit());
    }
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Game);
