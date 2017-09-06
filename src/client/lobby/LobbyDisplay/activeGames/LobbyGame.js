import React, { Component } from 'react';
import { connect } from 'react-redux';
import gameStyle from './ActiveGames.css';
import {emojify} from 'react-emojione';
import MiniMap from './MiniMap';
import eye from '../../../images/icons/eye.png';
import eyeselected from '../../../images/icons/eyeselected.png';

export default class LobbyGame extends Component {
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
        const spectateButtons = (
            <div>
                <div className={gameStyle.spectatorDiv}>
                    <button onClick={() => {this.observeGame(this.props.game.id)}}> Spectate </button>
                </div>
                {!this.props.tabbed ?
                    (this.state.showMiniMap ?
                        <div>
                            <img onMouseLeave={this.hideMiniMap} src={eyeselected} />
                            <div className={gameStyle.mapHolder} >
                                <MiniMap gameState={this.props.gameState}/>
                            </div>
                        </div>
                        : <img src={eye} onMouseEnter={this.displayMiniMap}/>
                    )
                    : null
                }
            </div>
        );
        return (
            <div>
                <div className={gameStyle.game}>
                <h1> {emojify(this.props.game.name)} </h1>
                {this.props.game.winner ? <h2> {this.props.game.winner} Won </h2> : spectateButtons}
                </div>
            </div>
        );
    }
}
