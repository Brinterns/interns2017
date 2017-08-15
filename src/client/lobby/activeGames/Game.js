import React, { Component } from 'react';
import { connect } from 'react-redux';
import gameStyle from './ActiveGames.css';
import {emojify} from 'react-emojione';
import MiniMap from './MiniMap';

export default class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMiniMap: false
        };
        this.observeGame = this.observeGame.bind(this);
        this.displayMiniMap = this.displayMiniMap.bind(this);
        this.hideMiniMap = this.hideMiniMap.bind(this);
        // this.getGameInfo = this.getGameInfo.bind(this);
    }

    observeGame(gameId) {
        cloak.message('observegame', gameId);
    }
    //every 1.5s the client sends a message asking about this room
    //if and only if the cursor is still hovering on the a
    getGameInfo() {
        cloak.message('getgameinfo', this.props.game.id);
        setTimeout(() => {
            if (!this.state.showMiniMap) {
                return;
            }
            this.getGameInfo();
        }, 1000);
    }

    displayMiniMap() {
        this.setState({
            showMiniMap: true
        });
        this.getGameInfo();
    }

    hideMiniMap() {
        this.setState({
            showMiniMap: false
        });
    }

    render() {
        return (
            <div className={gameStyle.game} onMouseEnter={this.displayMiniMap} onMouseLeave={this.hideMiniMap}>
                <h1> {emojify(this.props.game.name)} </h1>
                {this.props.game.winner ? <h2> {this.props.game.winner} Won </h2> : <button onClick={() => {this.observeGame(this.props.game.id)}}> Spectate </button>}
                {this.state.showMiniMap ? <MiniMap gameState={this.props.gameState}/> : <p> dont show </p>}
            </div>
        );
    }
}
