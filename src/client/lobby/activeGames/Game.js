import React, { Component } from 'react';
import { connect } from 'react-redux';
import gameStyle from './ActiveGames.css';
import {emojify} from 'react-emojione';

export default class Game extends Component {
    constructor(props) {
        super(props);
        this.observeGame = this.observeGame.bind(this);
    }

    observeGame(gameId) {
        cloak.message('observegame', gameId);
    }

    render() {
        return (
            <div className={gameStyle.game}>
                <h1> {emojify(this.props.game.name)} </h1>
                {this.props.game.winner ? <h2> {this.props.game.winner} Won </h2> : <button onClick={() => {this.observeGame(this.props.game.id)}}> Spectate </button>}
            </div>
        );
    }
}
