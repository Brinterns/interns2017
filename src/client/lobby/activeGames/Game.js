import React, { Component } from 'react';
import { connect } from 'react-redux';
import gameStyle from './ActiveGames.css';
import {emojify} from 'react-emojione';

export default class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMiniMap: false
        };
        this.observeGame = this.observeGame.bind(this);
        this.displayMiniMap = this.displayMiniMap.bind(this);
        this.hideMiniMap = this.hideMiniMap.bind(this);
    }

    observeGame(gameId) {
        cloak.message('observegame', gameId);
    }

    displayMiniMap() {
        cloak.message('getgameinfo', this.props.game.id);
        this.setState({
            showMiniMap: true
        });
        while (this.state.showMiniMap) {
            setTimeout(() => {
                cloak.message('getgameinfo', this.props.game.id);
            }, 1000);
        }
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
                {this.state.displayMiniMap ? <p> HELLO </p> : null}
            </div>
        );
    }
}
