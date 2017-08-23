import React, { Component } from 'react';
import { connect } from 'react-redux';
import boardStyles from './ActiveGames.css';
import {emojify} from 'react-emojione';
import Piece from '../../game/board/Piece';
import OpponentPiece from '../../game/board/OpponentPiece';
import Square from '../../game/board/Square';

const playerPath = [
    14,  17,  20,  23,
    22,  19,  16,  13,
    10,  7,  4,  1,
    2,  5,  8
];

export default class MiniMap extends Component {
    constructor(props) {
        super(props);
        this.squareType = this.squareType.bind(this);
    }

    squareType(i) {
        const pos = playerPath.indexOf(i) + 1;
        var displayNumber = null;
        if ((i === 8) && this.props.gameState.numPiecesFinished) {
            displayNumber = (this.props.gameState.numPiecesFinished > 1) ? this.props.gameState.numPiecesFinished : null;
        } else if ((i === 6) && this.props.gameState.numOppPiecesFinished) {
            displayNumber = (this.props.gameState.numOppPiecesFinished > 1) ? this.props.gameState.numOppPiecesFinished : null;
        }
        var powerUp = this.props.gameState.powerUps.includes(i);
        var powerUpInfo = null;
        this.props.gameState.activePowerUps.forEach((activePowerUp) => {
            if((i !== 8) && (i !== 6) && activePowerUp.powerUp && (activePowerUp.squareIndex === i)) {
                powerUpInfo = activePowerUp;
            }
        });
        return (
            <Square index={i} position={pos} displayNumber={displayNumber} movePiece={() => {}} piece={this.props.gameState.squares[i]} opponentPiece={this.props.gameState.opponentSquares[i]} pieceClassName={boardStyles.squarePiece} setHighlightSquare={() => {}} highlight={false} minimap={true} powerUp={powerUp} powerUpInfo={powerUpInfo} key={i} />
        );
    }

    render() {
        const pieceHolder = [];
        const oppPieceHolder = [];
        const squareCols = [];
        if (!this.props.gameState) {
            return null;
        }
        for (var i = 0; i < this.props.gameState.numberOfPieces; i++) {
            const pos = this.props.gameState.piecePositions[i];
            if (pos === 0) {
                pieceHolder.push(<Piece position={pos} className={boardStyles.piece} movePiece={() => {}} setHighlightSquare={() => {}} key={i} minimap={true}/>);
            }
        }
        var oppPieceHolderSize = this.props.gameState.numberOfPieces - this.props.gameState.opponentSquares.filter((square) => {return square}).length;
        if (this.props.gameState.numOppPiecesFinished > 1) {
            oppPieceHolderSize -= (this.props.gameState.numOppPiecesFinished - 1);
        }
        for (var i = 0; i < oppPieceHolderSize; i++) {
            oppPieceHolder.push(<OpponentPiece minimap={true} className={boardStyles.piece} key={i}/>)
        }
        for (var i = 0; i < 24; i += 3) {
            squareCols.push(
                <div key={i} className={boardStyles.squaresColumn}>
                    {this.squareType(i)}
                    {this.squareType(i+1)}
                    {this.squareType(i+2)}
                </div>
            );
        }
        return (
            <div className={boardStyles.minimapDiv}>
                <div className={boardStyles.oppPieceHolder}>
                    <p> {this.props.gameState.playerName} </p>
                    {oppPieceHolder}
                </div>
                <div className={boardStyles.boardMainDiv}>
                    {squareCols}
                </div>
                <div className={boardStyles.pieceHolder}>
                    {pieceHolder}
                    <p> {this.props.gameState.name} </p>
                </div>
            </div>
        );
    }
}
