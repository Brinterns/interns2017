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
                cloak.message('reconnectuser', [localStorage.getItem('userId'), localStorage.getItem('dbId')]);
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
                <button onClick={this.returnToLobby}> Return To Lobby </button>
                <Stats id={this.props.id} stats={this.props.gameStats} gameOver={true}/>
            </div>
        );

        let gameInfo = null;
        let currentPlayerText = null;
        let notifMessage;
        let currentPlayerName = "";
        let notifDiv = null;
        if (this.props.listOfPlayers.length) {
            const currentPlayer = this.props.listOfPlayers.filter(player => {
                return player.id === this.props.currentPlayer;
            })[0];
            if (currentPlayer) {
                currentPlayerName = emojify(currentPlayer.name);
                currentPlayerText = "It's " + currentPlayerName + "'s turn";
            }
            if (this.props.powerUpNotif) {
                notifMessage = currentPlayerName + " used ";
                var picture = require('../images/powerups/'+ this.props.powerUpNotif +'.png');
                notifDiv = (<div className={gameStyles.powerNotificationDiv}> <p>{notifMessage}</p> <div style={{background: 'url(' + picture + ')'}} /> </div>);
            } else if (this.props.playerRollNumber !== null) {
                notifMessage = (<p>{emojify(this.props.notificationText)}</p>);
                notifDiv = (<div className={gameStyles.notificationDiv}> {notifMessage} </div>);
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
        var spectatorText = !this.props.spectators.length ? "No Spectators" : "";
        this.props.spectators.forEach(function(spectator) {
            spectatorText += spectator + "\n";
        });
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
                    <p title={spectatorText}>Spectators ({this.props.spectators.length})</p>
                </div>
                <Stats id={this.props.id} stats={this.props.gameStats}/>
                <ChatBox id={this.props.id} messages={this.props.messages}/>
                {(!this.props.winnerId && this.props.notificationBool) ? notifDiv : null}
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
    spectators: state.game.spectators,
    //Notification states
    notificationBool: state.game.notificationBool,
    notificationText: state.game.notificationText,
    powerUpNotif: state.game.powerUpNotif,
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
