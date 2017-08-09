import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import gameStyles from './Game.css';
import Rules from '../rules/Rules';
import Board from './board/Board';
import { connect } from 'react-redux';
import ChatBox from '../Chat/ChatBox';
import Stats from './statistics/Stats';
import {emojify} from 'react-emojione';

import { RunCloakConfig } from '../services/cloak-service';

import {
    toggleForfeit
} from './Game-actions';

export class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rules: false
        };
        this.handleToggleRules = this.handleToggleRules.bind(this);
        this.onWin = this.onWin.bind(this);
        this.onClickForfeit = this.onClickForfeit.bind(this);
        this.reChallenge = this.reChallenge.bind(this);
        this.returnToLobby = this.returnToLobby.bind(this);
        {this.getGameInfo()};
    }

    handleToggleRules() {
        this.setState({
            rules: !this.state.rules
        });
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

    reChallenge() {
        cloak.message('rechallenge', _);
    }

    reChallengeResponse(accept) {
        cloak.message('rechallengeresponse', accept);
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
        var gameOverTextChoice = (this.props.winnerId === this.props.id) ? "You Won!" : "You Lost";
        if (this.props.opponentDisconnect) {
            gameOverTextChoice = "Opponent Left, " + gameOverTextChoice;
        }
        var challengeButton;
        if (this.props.challengerId === this.props.id) {
            challengeButton = <button className={gameStyles.reChallenge} onClick={() => {this.reChallengeResponse(false)}}> Cancel </button>;
        } else if (this.props.challengerId) {
            challengeButton = <div>
                    <button className={gameStyles.acceptButton} onClick={() => {this.reChallengeResponse(true)}}> &#10004; </button>
                    <button className={gameStyles.declineButton} onClick={() => {this.reChallengeResponse(false)}}> &#x2716; </button>
                </div>;
        } else {
            challengeButton = <button className={gameStyles.reChallenge} onClick={this.reChallenge}> Re-Challenge </button>;
        }
        const gameOverDiv = (
            <div className={gameStyles.notificationMenu}>
                <h1> {gameOverTextChoice} </h1>
                <button className={gameStyles.returnButton} onClick={this.returnToLobby}> Return To Lobby </button>
                {(!this.props.opponentDisconnect && (this.props.listOfPlayers.length > 1)) ? challengeButton : null}
            </div>
        );
        const forfeitDiv = (
            <div className={gameStyles.notificationMenu}>
                <h1> Are you sure you want to forfeit? </h1>
                <button className={gameStyles.acceptButton} onClick={() => this.onWin(false)}> &#10004; </button>
                <button className={gameStyles.declineButton} onClick={this.onClickForfeit}> &#x2716; </button>
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
                currentPlayerText = isPlayerTurn ? "It's your turn" : "It's " + currentPlayer.name + "'s" + " turn";
            }

            if (this.props.opponentRollNumber === 0) {
                opponentRoll = (<div><p>{this.props.notificationText}</p><p className={gameStyles.turnNotif}>{currentPlayerText}</p></div>);
            } else if (this.props.opponentRollNumber !== null) {
                opponentRoll = (<p className={isPlayerTurn ? gameStyles.turnNotif : null}>{this.props.notificationText}</p>);
            }

            gameInfo = <ul> {this.props.listOfPlayers.map((player, index) => {
                return <li key={index}> {emojify(player.name)} ({player.elorank}) {(player.id === this.props.id) ? <p>&#9733;</p> : null} </li>
            })} </ul>;
        }
        return (
            <div>
                <div className={gameStyles.gameMain}>
                    {gameInfo}
                    <button className={gameStyles.forfeit} onClick={this.onClickForfeit}> Forfeit </button>
                    <button className={gameStyles.rules} onClick={this.handleToggleRules}> Rules </button>
                    <h1> {currentPlayerText ? emojify("" + currentPlayerText) : null} </h1>
                    <Board gameState={this.state} isPlayerTurn={isPlayerTurn}/>
                    {(this.props.winnerId) ? gameOverDiv : null}
                    {this.props.forfeit ? forfeitDiv : null}
                </div>
                <Stats id={this.props.id} stats={this.props.gameStats}/>
                <ChatBox id={this.props.id} messages={this.props.messages}/>
                {this.state.rules && !this.props.winnerId ? <Rules toggleRules={this.handleToggleRules} /> : null}
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
    forfeit: state.game.forfeit,
    gameOver: state.game.gameOver,
    winnerId: state.game.winnerId,
    //Notification states
    notificationBool: state.game.notificationBool,
    notificationText: state.game.notificationText,
    opponentDisconnect: state.game.opponentDisconnect,
    challengerId: state.game.challengerId,
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
)(Game);
