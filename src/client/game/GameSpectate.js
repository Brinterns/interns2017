import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import gameStyles from './Game.css';
import BoardSpectate from './board/BoardSpectate';
import { connect } from 'react-redux';
import ChatBox from '../Chat/ChatBox';
import {emojify} from 'react-emojione';

import { RunCloakConfig } from '../services/cloak-service';

export class GameSpectate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leaveMenu: false
        };
        this.toggleLeaveMenu = this.toggleLeaveMenu.bind(this);
        this.returnToLobby = this.returnToLobby.bind(this);
        {this.getGameInfo()};
    }

    toggleLeaveMenu() {
        this.setState({
            leaveMenu: !this.state.leaveMenu
        });
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
            var gameOverText = "Game Over, " + this.props.listOfPlayers.filter(player => {
                return player.id === this.props.winnerId;
            })[0].name;
        }
        const gameOverDiv = (
            <div className={gameStyles.notificationMenu}>
                <h1> {gameOverText} </h1>
                <button className={gameStyles.returnButton} onClick={this.returnToLobby}> Return To Lobby </button>
            </div>
        );
        const leaveDiv = (
            <div className={gameStyles.notificationMenu}>
                <h1> Are you sure you want to leave? </h1>
                <button className={gameStyles.acceptButton} onClick={this.returnToLobby}> &#10004; </button>
                <button className={gameStyles.declineButton} onClick={this.toggleLeaveMenu}> &#x2716; </button>
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
                currentPlayerText = "It's " + currentPlayer.name + "'s" + " turn";
            }

            if (this.props.opponentRollNumber === 0) {
                opponentRoll = (<div><p>{this.props.notificationText}</p><p className={gameStyles.turnNotif}>{currentPlayerText}</p></div>);
            } else if (this.props.opponentRollNumber !== null) {
                opponentRoll = (<p className={gameStyles.turnNotif}>{this.props.notificationText}</p>);
            }

            gameInfo = <ul> {this.props.listOfPlayers.map((player, index) => {
                return <li key={index}> {player.name} ({player.elorank}) {(player.id === this.props.id) ? <p>&#9733;</p> : null} </li>
            })} </ul>;
        }

        return (
            <div>
                <div className={gameStyles.gameMain}>
                    {gameInfo}
                    <button className={gameStyles.forfeit} onClick={this.toggleLeaveMenu}> Leave </button>
                    <h1> {currentPlayerText ? emojify("" + currentPlayerText) : null} </h1>
                    <BoardSpectate gameState={this.state} />
                    {(this.props.winnerId) ? gameOverDiv : null}
                    {this.state.leaveMenu ? leaveDiv : null}
                </div>
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
    opponentDisconnect: state.game.opponentDisconnect
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
