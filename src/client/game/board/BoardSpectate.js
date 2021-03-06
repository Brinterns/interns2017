import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import boardStyles from './Board.css';
import Piece from './Piece';
import OpponentPiece from './OpponentPiece';
import Square from './Square';
import { connect } from 'react-redux';

export class BoardSpectate extends Component {
    constructor(props) {
        super(props);
        this.squareType = this.squareType.bind(this);
    }

    squareType(i) {
        const pos = this.props.playerPath.indexOf(i) + 1;
        const relativePos = this.props.squares[i] ? this.props.playerPath.indexOf(i) + 1 : this.props.opponentPath.indexOf(i) + 1;
        var displayNumber = null;
        if ((i === 8) && this.props.numPiecesFinished) {
            displayNumber = (this.props.numPiecesFinished > 1) ? this.props.numPiecesFinished : null;
        } else if ((i === 6) && this.props.numOppPiecesFinished) {
            displayNumber = (this.props.numOppPiecesFinished > 1) ? this.props.numOppPiecesFinished : null;
        }
        var powerUpInfo = null;
        this.props.activePowerUps.forEach((activePowerUp) => {
            if((i !== 8) && (i !== 6) && activePowerUp.powerUp && (activePowerUp.squareIndex === i)) {
                powerUpInfo = activePowerUp;
            }
        });
        var powerUp = this.props.powerUps.includes(i);
        return (
            <Square index={i} position={pos} displayNumber={displayNumber} movePiece={() => {}} piece={this.props.squares[i]} opponentPiece={this.props.opponentSquares[i]} pieceClassName={boardStyles.squarePiece} powerUp={powerUp} setHighlightSquare={() => {}} highlight={false} powerUpInfo={powerUpInfo} key={i} />
        );
    }

    render() {
        const pieceHolder = [];
        const oppPieceHolder = [];
        const squareCols = [];
        for (var i = 0; i < this.props.numberOfPieces; i++) {
            const pos = this.props.piecePositions[i];
            if (pos === 0) {
                pieceHolder.push(<Piece position={pos} className={boardStyles.piece} movePiece={() => {}} setHighlightSquare={() => {}} key={i}/>);
            }
        }
        var oppPieceHolderSize = this.props.numberOfPieces - this.props.opponentSquares.filter((square) => {return square}).length;
        if (this.props.numOppPiecesFinished > 1) {
            oppPieceHolderSize -= (this.props.numOppPiecesFinished - 1);
        }
        for (var i = 0; i < oppPieceHolderSize; i++) {
            oppPieceHolder.push(<OpponentPiece className={boardStyles.piece} key={i}/>)
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
            <div>
                <div className={boardStyles.boardMainDiv}>
                    {squareCols}
                </div>
                <div className={boardStyles.oppPieceHolder}>
                    <p> {this.props.opponentName} </p>
                    {oppPieceHolder}
                </div>
                <div className={boardStyles.pieceHolder}>
                    {pieceHolder}
                    <p> {this.props.spectatingName} </p>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    //Game states
    numberOfPieces: state.game.numberOfPieces,
    squares: state.game.squares,
    piecePositions: state.game.piecePositions,
    opponentSquares: state.game.opponentSquares,
    numOppPiecesFinished: state.game.numOppPiecesFinished,
    numPiecesFinished: state.game.numPiecesFinished,
    powerUps: state.game.powerUps,
    powerUpPieces: state.game.powerUpPieces,
    activePowerUps: state.game.activePowerUps,
    playerPath: state.game.playerPath,
    opponentPath: state.game.opponentPath
});

export default connect(
    mapStateToProps
)(BoardSpectate);
