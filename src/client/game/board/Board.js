import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import boardStyles from './Board.css';
import Piece from './Piece';
import RollFlash from './Roll/RollFlash';
import Roll from './Roll/Roll';
import OpponentPiece from './OpponentPiece';
import Square from './Square';
import { connect } from 'react-redux';

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
        if ((pos !== 15) && this.props.isPlayerTurn && this.props.rolled && this.props.moveablePositions.includes(pos) && !this.props.winnerId && !this.props.opponentSquares[i]) {
            pieceClassName = boardStyles.moveableSquarePiece;
            if ((this.props.rollNumber + pos) === 15) {
                pieceClassName = boardStyles.finishSquarePiece;
            }
        }
        var displayNumber = null;
        if ((i === 8) && this.props.numPiecesFinished) {
            displayNumber = (this.props.numPiecesFinished > 1) ? this.props.numPiecesFinished : null;
        } else if ((i === 6) && this.props.numOppPiecesFinished) {
            displayNumber = (this.props.numOppPiecesFinished > 1) ? this.props.numOppPiecesFinished : null;
        }
        var powerUp = false;
        if (this.props.powerUps.includes(i)) {
            powerUp = true;
        }
        return (
            <Square index={i} position={pos} displayNumber={displayNumber} movePiece={this.handleMovePiece} piece={this.props.squares[i]} opponentPiece={this.props.opponentSquares[i]} pieceClassName={pieceClassName} powerUp={powerUp} setHighlightSquare={this.setHighlightSquare} highlight={(pos === this.state.highlightSquarePosition)} key={i} />
        );
    }

    onClick() {
        if (this.props.isPlayerTurn && !this.props.rolled && !this.props.winnerId) {
            cloak.message('rolldice', _);
        }
    }

    setHighlightSquare(pos) {
        if (((pos === null) && (this.state.highlightSquarePosition !== null)) || this.props.winnerId) {
            this.setState({
                highlightSquarePosition: null
            });
            return;
        }
        if (this.props.isPlayerTurn && this.props.rolled && !this.props.winnerId) {
            if(this.props.moveablePositions.includes(pos)) {
                this.setState({
                    highlightSquarePosition: pos + this.props.rollNumber
                });
            }
        }
    }

    handleMovePiece(position) {
        if (this.props.isPlayerTurn && this.props.rolled && this.props.moveablePositions.includes(position) && !this.props.winnerId) {
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
        for (var i = 0; i < this.props.numberOfPieces; i++) {
            const pos = this.props.piecePositions[i];
            if (pos === 0) {
                if (this.props.isPlayerTurn && this.props.rolled && this.props.moveablePositions.includes(pos) && !this.props.winnerId) {
                    pieceHolder.push(<Piece position={pos} className={boardStyles.moveablePiece} movePiece={this.handleMovePiece} setHighlightSquare={this.setHighlightSquare} key={i}/>);
                    continue;
                }
                pieceHolder.push(<Piece position={pos} className={boardStyles.piece} movePiece={this.handleMovePiece} setHighlightSquare={this.setHighlightSquare} key={i}/>);
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
        const rollSequenceNotClickable = (<RollFlash sequence={this.props.rollSequence} rollNumber={this.props.rollNumber} className={boardStyles.rollButton} />);
        const rollSequenceClickable = (<div onClick={this.onClick} > <Roll rollNumber={this.props.rollNumber} isPlayerTurn={this.props.isPlayerTurn}/></div>);
        var powerUpStyle;
        if (this.props.powerUp) {
            var picture = require('../../images/powerups/'+ this.props.powerUp +'.png');
            powerUpStyle = {
                background: 'url(' + picture + ')',
                backgroundSize: 'calc(5.4 * (1vw + 1vh - 1vmin))'
            }
        }
        return (
            <div>
                <div className={boardStyles.boardMainDiv}>
                    {squareCols}
                </div>
                <div className={boardStyles.rollButton}>
                    {((this.props.rollNumber !== 'Roll' || this.props.rollSequence) && this.props.isPlayerTurn) ? rollSequenceNotClickable : rollSequenceClickable}
                </div>
                <div className={boardStyles.powerUpDiv} style={powerUpStyle} />
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
    winnerId: state.game.winnerId,
    //Roll states
    rolled: state.game.rolled,
    rollNumber: state.game.rollNumber,
    rollSequence: state.game.rollSequence,
    //Game states
    numberOfPieces: state.game.numberOfPieces,
    squares: state.game.squares,
    opponentSquares: state.game.opponentSquares,
    piecePositions: state.game.piecePositions,
    moveablePositions: state.game.moveablePositions,
    numOppPiecesFinished: state.game.numOppPiecesFinished,
    numPiecesFinished: state.game.numPiecesFinished,
    powerUps: state.game.powerUps,
    powerUp: state.game.powerUp
});

export default connect(
    mapStateToProps
)(Board);
