import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import gameStyles from './Game.css';
import Rules from '../rules/Rules';
import Board from './board/Board';
import { connect } from 'react-redux';
import ChatBox from '../Chat/ChatBox';
import Stats from './statistics/Stats';
import {emojify} from 'react-emojione';
import RollFlash from './board/Roll/RollFlash';

import { RunCloakConfig } from '../services/cloak-service';

import {
    toggleForfeit
} from './Game-actions';

export class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numberOfPieces: 7,
            rules: false
        };
        this.handleToggleRules = this.handleToggleRules.bind(this);
        this.onWin = this.onWin.bind(this);
        this.onClickForfeit = this.onClickForfeit.bind(this);
        this.handleChange = this.handleChange.bind(this);
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

    handleChange(event) {
        if ((event.target.id === "minus") && (this.state.numberOfPieces > 1)) {
            this.setState({
                numberOfPieces: this.state.numberOfPieces - 1
            });
        } else if ((event.target.id === "plus") && (this.state.numberOfPieces < 9)) {
            this.setState({
                numberOfPieces: this.state.numberOfPieces + 1
            });
        }
    }

    reChallenge() {
        cloak.message('rechallenge', this.state.numberOfPieces);
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
                cloak.message('reconnectuser', [localStorage.getItem('userId'), localStorage.getItem('dbId')]);
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
        var numPiecesButtons;
        if (this.props.challengerId === this.props.id) {
            challengeButton = <button onClick={() => {this.reChallengeResponse(false)}}> Cancel </button>;
            numPiecesButtons =
                <div className={gameStyles.numberOfPieces}>
                    <label title="No. of pieces" className={gameStyles.numberOfPiecesInactive}> <p>{this.props.newNumberOfPieces}</p> </label>
                </div>;
        } else if (this.props.challengerId) {
            challengeButton =
                <div className={gameStyles.buttonsEnd}>
                    <button className={gameStyles.acceptButton} onClick={() => {this.reChallengeResponse(true)}}> &#10004; </button>
                    <button className={gameStyles.declineButton} onClick={() => {this.reChallengeResponse(false)}}> &#x2716; </button>
                </div>;
                numPiecesButtons =
                    <div className={gameStyles.numberOfPieces}>
                        <label title="No. of pieces" className={gameStyles.numberOfPiecesInactive}> <p>{this.props.newNumberOfPieces}</p> </label>
                    </div>;
        } else {
            challengeButton = <button onClick={this.reChallenge}> Re-Challenge </button>;
            numPiecesButtons = 
                <div className={gameStyles.numberOfPieces}>
                    <button id="minus" title="Decrease no. of pieces" onClick={this.handleChange}> - </button>
                    <label title="No. of pieces"> <p>{this.state.numberOfPieces}</p> </label>
                    <button id="plus" title="Increase no. of pieces" onClick={this.handleChange}> + </button>
                </div>;
        }

        const gameOverDiv = (
            <div className={gameStyles.gameOverMenu}>
                <p> {gameOverTextChoice} </p>
                {(!this.props.opponentDisconnect && (this.props.listOfPlayers.length > 1)) ? challengeButton : null}
                {(!this.props.opponentDisconnect && (this.props.listOfPlayers.length > 1)) ? numPiecesButtons : null}
                <button className={gameStyles.returnButton} onClick={this.returnToLobby}> Return To Lobby </button>
                <Stats id={this.props.id} stats={this.props.gameStats} gameOver={true}/>
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
        let currentPlayerName = "";
        if (this.props.listOfPlayers.length) {
            const currentPlayer = this.props.listOfPlayers.filter(player => {
                return player.id === this.props.currentPlayer;
            })[0];
            if (currentPlayer) {
                currentPlayerName = emojify(currentPlayer.name);
                currentPlayerText = isPlayerTurn ? "It's your turn" : "It's " + currentPlayerName + "'s turn";
            }

            if ((this.props.opponentRollNumber === 0) || (isPlayerTurn && !isNaN(this.props.notificationText.slice(-1)))) {
                opponentRoll = (<div><p>{emojify(this.props.notificationText)}</p><p className={gameStyles.turnNotif}>{currentPlayerText}</p></div>);
            } else if (this.props.opponentRollNumber !== null) {
                opponentRoll = (<p className={isPlayerTurn ? gameStyles.turnNotif : null}>{emojify(this.props.notificationText)}</p>);
            }

            gameInfo = <ul> {this.props.listOfPlayers.map((player, index) => {
                return <li key={index}> {emojify(player.name)} ({player.elorank}) {(player.id === this.props.id) ? <p>&#9733;</p> : null} </li>
            })} </ul>;
        }
        var spectatorText = !this.props.spectators.length ? "No Spectators" : "";
        this.props.spectators.forEach(function(spectator) {
            spectatorText += spectator + "\n";
        });
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
                <div className={gameStyles.spectatorDiv}>
                    <p title={spectatorText}> Spectators ({this.props.spectators.length}) </p>
                </div>
                {this.props.winnerId ? null : <Stats id={this.props.id} stats={this.props.gameStats}/>}
                <ChatBox id={this.props.id} messages={this.props.messages}/>
                {this.state.rules && !this.props.winnerId ? <Rules toggleRules={this.handleToggleRules} /> : null}
                {(!this.props.winnerId && this.props.opponentRollSequence) ? <div className={gameStyles.notificationDiv}> <p>{currentPlayerName} is rolling</p> <RollFlash sequence={this.props.opponentRollSequence}/> </div> : null}
                {(!this.props.winnerId && this.props.notificationBool) ? <div className={gameStyles.notificationDiv}> {opponentRoll} </div> : null}
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
    opponentRollSequence: state.game.oppRollSequence,
    //End game states
    forfeit: state.game.forfeit,
    gameOver: state.game.gameOver,
    winnerId: state.game.winnerId,
    spectators: state.game.spectators,
    //Notification states
    notificationBool: state.game.notificationBool,
    notificationText: state.game.notificationText,
    opponentDisconnect: state.game.opponentDisconnect,
    challengerId: state.game.challengerId,
    newNumberOfPieces: state.game.newNumberOfPieces,
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
