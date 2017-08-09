import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import boardStyles from './Board.css';
import Piece from './Piece';
import OpponentPiece from './OpponentPiece';
import Square from './Square';
import { connect } from 'react-redux';

const numberOfPieces = 7;

const playerPath = [
    14,  17,  20,  23,
    22,  19,  16,  13,
    10,  7,  4,  1,
    2,  5,  8
];

export class BoardSpectate extends Component {
    constructor(props) {
        super(props);
        this.squareType = this.squareType.bind(this);
    }

    squareType(i) {
        const pos = playerPath.indexOf(i) + 1;
        var displayNumber = null;
        if ((i === 8) && this.props.numPiecesFinished) {
            displayNumber = (this.props.numPiecesFinished > 1) ? this.props.numPiecesFinished : null;
        } else if ((i === 6) && this.props.numOppPiecesFinished) {
            displayNumber = (this.props.numOppPiecesFinished > 1) ? this.props.numOppPiecesFinished : null;
        }
        return (
            <Square index={i} position={pos} displayNumber={displayNumber} movePiece={null} piece={this.props.squares[i]} opponentPiece={this.props.opponentSquares[i]} pieceClassName={boardStyles.squarePiece} setHighlightSquare={null} highlight={false} key={i} />
        );
    }

    render() {
        const pieceHolder = [];
        const oppPieceHolder = [];
        const squareCols = [];
        for (var i = 0; i < 7; i++) {
            const pos = this.props.piecePositions[i];
            if (pos === 0) {
                if (this.props.isPlayerTurn && this.props.rolled && this.props.moveablePositions.includes(pos)) {
                    pieceHolder.push(<Piece position={pos} className={boardStyles.piece} movePiece={null} setHighlightSquare={null} key={i}/>);
                    continue;
                }
                pieceHolder.push(<Piece position={pos} className={boardStyles.piece} movePiece={null} setHighlightSquare={null} key={i}/>);
            }
        }
        var oppPieceHolderSize = numberOfPieces - this.props.opponentSquares.filter((square) => {return square}).length;
        if (this.props.numOppPiecesFinished > 1) {
            oppPieceHolderSize -= (this.props.numOppPiecesFinished - 1);
        }
        for (var i = 0; i < oppPieceHolderSize; i++) {
            oppPieceHolder.push(<OpponentPiece className={boardStyles.oppPiece} key={i}/>)
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
                    {oppPieceHolder}
                </div>
                <div className={boardStyles.pieceHolder}>
                    {pieceHolder}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    //Game states
    squares: state.game.squares,
    piecePositions: state.game.piecePositions,
    opponentSquares: state.game.opponentSquares,
    numOppPiecesFinished: state.game.numOppPiecesFinished,
    numPiecesFinished: state.game.numPiecesFinished
});

export default connect(
    mapStateToProps
)(BoardSpectate);
