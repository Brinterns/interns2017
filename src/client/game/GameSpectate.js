import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import gameStyles from './Game.css';
import BoardSpectate from './board/BoardSpectate';
import { connect } from 'react-redux';
import ChatBox from '../Chat/ChatBox';
import Stats from './statistics/Stats';
import {emojify} from 'react-emojione';

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
                gameOverText += ", " + winner[0].name + " Won";
            }
        }
        const gameOverDiv = (
            <div className={gameStyles.notificationMenu}>
                <h1> {gameOverText} </h1>
                <button className={gameStyles.returnButton} onClick={this.returnToLobby}> Return To Lobby </button>
            </div>
        );
        let gameInfo = null;
        let currentPlayerText = null;
        let opponentRoll;
        if (this.props.listOfPlayers.length) {
            const currentPlayer = this.props.listOfPlayers.filter(player => {
                return player.id === this.props.currentPlayer;
            })[0];
            if (currentPlayer) {
                currentPlayerText = "It's " + currentPlayer.name + "'s turn";
            }

            if (this.props.opponentRollNumber === 0) {
                opponentRoll = (<div><p>{this.props.notificationText}</p><p>{currentPlayerText}</p></div>);
            } else if (this.props.opponentRollNumber !== null) {
                opponentRoll = (<p>{this.props.notificationText}</p>);
            }

            gameInfo = <ul> {this.props.listOfPlayers.map((player, index) => {
                return <li key={index}> {player.name} ({player.elorank}) {(player.id === this.props.id) ? <p>&#9733;</p> : null} </li>
            })} </ul>;

            const spectatingPlayer = this.props.listOfPlayers.filter(player => {
                return player.id === this.props.spectatingId;
            });
            var spectatingName = null;
            if (spectatingPlayer[0]) {
                spectatingName = spectatingPlayer[0].name;
            }
            const opponentPlayer = this.props.listOfPlayers.filter(player => {
                return player.id !== this.props.spectatingId;
            });
            var opponentName = null;
            if (opponentPlayer[0]) {
                opponentName = opponentPlayer[0].name;
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
                <Stats id={this.props.id} stats={this.props.gameStats}/>
                <ChatBox id={this.props.id} messages={this.props.messages}/>
                <div className={gameStyles.notificationDiv}>
                    {this.props.notificationBool ? opponentRoll : null}
                </div>
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
    opponentRollNumber: state.game.opponentRollNumber,
    //End game states
    gameOver: state.game.gameOver,
    winnerId: state.game.winnerId,
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
