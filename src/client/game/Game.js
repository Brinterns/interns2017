import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import gameStyles from './Game.css';
import Board from './board/Board';
import { connect } from 'react-redux';

import { RunCloakConfig } from '../services/cloak-service';

import {
    toggleForfeit
} from './Game-actions';

export class Game extends Component {
    constructor(props) {
        super(props);
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

    reconnectWait() {
        setTimeout(() => {
            if (cloak.connected()) {
                cloak.message('reconnectuser', localStorage.getItem('userId'));
                cloak.message('getroominfo', _);
            } else {
                this.reconnectWait();
            }
        }, 300);
    }

    getGameInfo() {
        RunCloakConfig();
        if(cloak.connected()) {
            cloak.message('getroominfo', _);
        } else {
            this.reconnectWait();
        }
    }

    render() {
        const isPlayerTurn = (this.props.currentPlayer === this.props.id);
        const gameOverTextChoice = (this.props.winnerId == this.props.id) ? "You Won!" : "You Lost";
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
        let currentPlayerText = null;
        let opponentRoll;
        if (this.props.listOfPlayers.length) {
            const currentPlayer = this.props.listOfPlayers.filter(player => {
                return player.id === this.props.currentPlayer;
            })[0];
            if (currentPlayer) {
                currentPlayerText = isPlayerTurn ? "It's your turn" : "It's " + currentPlayer.name + "'s" + " turn";
            }

            if (this.props.opponentRollNumber === 0) {
                opponentRoll = (<div><p>{this.props.notificationText}</p><p className={gameStyles.turnNotif}>{currentPlayerText}</p></div>);
            } else if (this.props.opponentRollNumber !== null) {
                opponentRoll = (<p className={isPlayerTurn ? gameStyles.turnNotif : null}>{this.props.notificationText}</p>);
            }
        }

        return (
            <div className={gameStyles.gameMain}>
                <h2> {currentPlayerText} </h2>
                <button className={gameStyles.forfeitButton} onClick={this.onClickForfeit}> FORFEIT </button>
                <h1> {this.props.roomName} </h1>
                <Board gameState={this.state} isPlayerTurn={isPlayerTurn}/>
                <div className={gameStyles.notificationDiv}>
                    {this.props.notificationBool ? opponentRoll : null}
                </div>
                {this.props.winnerId ? gameOverDiv : null}
                {this.props.forfeit ? forfeitDiv : null}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    //Identity states
    id: state.game.id,
    currentPlayer: state.game.currentPlayer,
    listOfPlayers: state.game.listOfPlayers,
    //Roll states
    opponentRollNumber: state.game.opponentRollNumber,
    //End game states
    forfeit: state.game.forfeit,
    gameOver: state.game.gameOver,
    winnerId: state.game.winnerId,
    roomName: state.game.roomName,
    //Notification states
    notificationBool: state.game.notificationBool,
    notificationText: state.game.notificationText
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
