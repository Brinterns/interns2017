import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import boardStyles from './Board.css';
import Piece from './Piece';
import Roll from './Roll';
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

export class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            highlightSquarePosition: null
        }
        this.onClick = this.onClick.bind(this);
        this.squareType = this.squareType.bind(this);
        this.handleMovePiece = this.handleMovePiece.bind(this);
        this.setHighlightSquare = this.setHighlightSquare.bind(this);
    }

    squareType(i) {
        const pos = playerPath.indexOf(i) + 1;
        var pieceClassName = boardStyles.squarePiece;
        if ((pos !== 15) && this.props.isPlayerTurn && this.props.rolled && !this.props.moveablePositions.includes(pos)) {
            pieceClassName = boardStyles.unmoveableSquarePiece;
        }
        var displayNumber = null;
        if ((i === 8) && this.props.numPiecesFinished) {
            displayNumber = (this.props.numPiecesFinished > 1) ? this.props.numPiecesFinished : null;
        } else if ((i === 6) && this.props.numOppPiecesFinished) {
            displayNumber = (this.props.numOppPiecesFinished > 1) ? this.props.numOppPiecesFinished : null;
        }
        return (
            <Square index={i} position={pos} displayNumber={displayNumber} movePiece={this.handleMovePiece} piece={this.props.squares[i]} opponentPiece={this.props.opponentSquares[i]} pieceClassName={pieceClassName} setHighlightSquare={this.setHighlightSquare} highlight={(pos === this.state.highlightSquarePosition)} key={i} />
        );
    }

    onClick() {
        if (this.props.isPlayerTurn && !this.props.rolled) {
            cloak.message('rolldice', _);
        }
    }

    setHighlightSquare(pos) {
        if ((pos === null) && (this.state.highlightSquarePosition !== null)) {
            this.setState({
                highlightSquarePosition: null
            });
            return;
        }
        if (this.props.isPlayerTurn && this.props.rolled) {
            if(this.props.moveablePositions.includes(pos)) {
                this.setState({
                    highlightSquarePosition: pos + this.props.rollNumber
                });
            }
        }
    }

    handleMovePiece(position) {
        if (this.props.isPlayerTurn && this.props.rolled && this.props.moveablePositions.includes(position)) {
            this.setState({
                highlightSquarePosition: null
            });
            cloak.message('movepiece', position);
        }
    }

    render() {
        const pieceHolder = [];
        const oppPieceHolder = [];
        const squareCols = [];
        for (var i = 0; i < 7; i++) {
            const pos = this.props.piecePositions[i];
            if (pos === 0) {
                if (this.props.isPlayerTurn && this.props.rolled && !this.props.moveablePositions.includes(pos)) {
                    pieceHolder.push(<Piece position={pos} className={boardStyles.unmoveablePiece} movePiece={this.handleMovePiece} setHighlightSquare={this.setHighlightSquare} key={i}/>);
                    continue;
                }
                pieceHolder.push(<Piece position={pos} className={boardStyles.piece} movePiece={this.handleMovePiece} setHighlightSquare={this.setHighlightSquare} key={i}/>);
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
                    <button onClick={this.onClick} className={boardStyles.rollButton}> {this.props.rollNumber} </button>
                    {(this.props.rolled) ? <Roll rollNumber={this.props.rollNumber} className={boardStyles.rollButton} /> : null}
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
    //Roll states
    rolled: state.game.rolled,
    rollNumber: state.game.rollNumber,
    //Game states
    squares: state.game.squares,
    opponentSquares: state.game.opponentSquares,
    piecePositions: state.game.piecePositions,
    moveablePositions: state.game.moveablePositions,
    numOppPiecesFinished: state.game.numOppPiecesFinished,
    numPiecesFinished: state.game.numPiecesFinished
});

export default connect(
    mapStateToProps
)(Board);
