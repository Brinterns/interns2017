import React, { Component } from 'react';
import { connect } from 'react-redux';
import {emojify} from 'react-emojione';
import activeGames from './ActiveGames.css';
import LobbyGame from './LobbyGame';

export class ActiveGames extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const gamesDisplayList = (
            this.props.listOfActiveGames.map((game, i) => {
                return (game.id === this.props.roomId) ? (<LobbyGame game={game} key={i} gameState={this.props} tabbed={this.props.tabbed}/>) : (<LobbyGame game={game} key={i} tabbed={this.props.tabbed} />);
            })
        );
        return (
            <div>
                {(this.props.listOfActiveGames === []) ? null : gamesDisplayList}
            </div>
        );
    }

}

const mapStateToProps = state => ({
    listOfActiveGames: state.lobby.listOfActiveGames,
    roomId: state.lobby.roomId,
    opponentDisconnect: state.lobby.opponentDisconnect,
    winnerId: state.lobby.winnerId,
    squares: state.lobby.squares,
    opponentSquares: state.lobby.opponentSquares,
    piecePositions: state.lobby.piecePositions,
    moveablePositions: state.lobby.moveablePositions,
    numPiecesFinished: state.lobby.numPiecesFinished,
    numOppPiecesFinished: state.lobby.numOppPiecesFinished,
    name: state.lobby.name,
    playerName: state.lobby.opponentName,
    numberOfPieces: state.lobby.numberOfPieces,
    powerUps: state.lobby.powerUps,
    activePowerUps: state.lobby.activePowerUps,
    playerPath: state.game.playerPath
});

export default connect(
    mapStateToProps
)(ActiveGames);
