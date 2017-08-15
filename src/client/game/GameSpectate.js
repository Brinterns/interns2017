import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import gameStyles from './Game.css';
import BoardSpectate from './board/BoardSpectate';
import { connect } from 'react-redux';
import ChatBox from '../Chat/ChatBox';
import Stats from './statistics/Stats';
import {emojify} from 'react-emojione';
import RollFlash from './board/Roll/RollFlash';


import { RunCloakConfig } from '../services/cloak-service';

export class GameSpectate extends Component {
    constructor(props) {
        super(props);
        this.returnToLobby = this.returnToLobby.bind(this);
        {this.getGameInfo()};
    }

    returnToLobby() {
        cloak.message('leavegame');
    }

    reconnectWait() {
        setTimeout(() => {
            if (cloak.connected()) {
                cloak.message('reconnectuser', localStorage.getItem('userId'));
                cloak.message('getroominfo');
            } else {
                this.reconnectWait();
            }
        }, 300);
    }

    getGameInfo() {
        RunCloakConfig();
        if(cloak.connected()) {
            cloak.message('getroominfo');
        } else {
            this.reconnectWait();
        }
    }

    render() {
        var gameOverText = null;
        if (this.props.winnerId) {
            gameOverText = "Game Over";
            const winner = this.props.listOfPlayers.filter(player => {
                return player.id === this.props.winnerId;
            });
            if (winner[0]) {
                gameOverText += ", " + emojify(winner[0].name) + " Won";
            }
        }
        
        const gameOverDiv = (
            <div className={gameStyles.gameOverMenu}>
                <p> {gameOverText} </p>
                <button className={gameStyles.returnButton} onClick={this.returnToLobby}> Return To Lobby </button>
                <Stats id={this.props.id} stats={this.props.gameStats} gameOver={true}/>
            </div>
        );

        let gameInfo = null;
        let currentPlayerText = null;
        let playerRoll;
        let currentPlayerName = "";
        if (this.props.listOfPlayers.length) {
            const currentPlayer = this.props.listOfPlayers.filter(player => {
                return player.id === this.props.currentPlayer;
            })[0];
            if (currentPlayer) {
                currentPlayerName = emojify(currentPlayer.name);
                currentPlayerText = "It's " + currentPlayerName + "'s turn";
            }

            if (this.props.playerRollNumber !== null) {
                playerRoll = (<p>{emojify(this.props.notificationText)}</p>);
            }

            gameInfo = <ul> {this.props.listOfPlayers.map((player, index) => {
                return <li key={index}> {emojify(player.name)} ({player.elorank}) </li>
            })} </ul>;

            const spectatingPlayer = this.props.listOfPlayers.filter(player => {
                return player.id === this.props.spectatingId;
            });
            var spectatingName = null;
            if (spectatingPlayer[0]) {
                spectatingName = emojify(spectatingPlayer[0].name);
            }
            const opponentPlayer = this.props.listOfPlayers.filter(player => {
                return player.id !== this.props.spectatingId;
            });
            var opponentName = null;
            if (opponentPlayer[0]) {
                opponentName = emojify(opponentPlayer[0].name);
            }
        }
        return (
            <div>
                <div className={gameStyles.gameMain}>
                    {gameInfo}
                    <button className={gameStyles.forfeit} onClick={this.returnToLobby}> Leave </button>
                    <h1> {currentPlayerText ? emojify("" + currentPlayerText) : null} </h1>
                    <BoardSpectate gameState={this.state} spectatingName={spectatingName} opponentName={opponentName} />
                    {(this.props.winnerId) ? gameOverDiv : null}
                </div>
                <div className={gameStyles.spectatorDiv}>
                    <p>Spectators ({this.props.numSpectators})</p>
                </div>
                <Stats id={this.props.id} stats={this.props.gameStats}/>
                <ChatBox id={this.props.id} messages={this.props.messages}/>
                {(!this.props.winnerId && this.props.notificationBool) ? <div className={gameStyles.notificationDiv}> {playerRoll} </div> : null}
                {(!this.props.winnerId && this.props.playerRollSequence) ? <div className={gameStyles.notificationDiv}> <p>{currentPlayerName} is rolling</p> <RollFlash sequence={this.props.playerRollSequence}/>  </div> : null}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    messages: state.game.messages,
    //Identity states
    id: state.game.id,
    spectatingId: state.game.spectatingId,
    currentPlayer: state.game.currentPlayer,
    listOfPlayers: state.game.listOfPlayers,
    //Roll states
    playerRollSequence: state.game.oppRollSequence,
    playerRollNumber: state.game.opponentRollNumber,
    //End game states
    gameOver: state.game.gameOver,
    winnerId: state.game.winnerId,
    numSpectators: state.game.numSpectators,
    //Notification states
    notificationBool: state.game.notificationBool,
    notificationText: state.game.notificationText,
    //Game stats
    gameStats: state.game.gameStats
});

const mapDispatchToProps = dispatch => ({
    toggleForfeit(){
        dispatch(toggleForfeit());
    }
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GameSpectate);
