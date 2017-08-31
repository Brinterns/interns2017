import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import boardStyles from './Board.css';
import Piece from './Piece';
import PowerUp from './powerup/PowerUp';
import RollFlash from './Roll/RollFlash';
import Roll from './Roll/Roll';
import OpponentPiece from './OpponentPiece';
import Square from './Square';
import { connect } from 'react-redux';

export class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            highlightSquarePosition: null,
            powerUpActive: false
        }
        this.onClick = this.onClick.bind(this);
        this.squareType = this.squareType.bind(this);
        this.handleMovePiece = this.handleMovePiece.bind(this);
        this.setHighlightSquare = this.setHighlightSquare.bind(this);
        this.togglePowerUp = this.togglePowerUp.bind(this);
        this.usePowerUp = this.usePowerUp.bind(this);
    }

    squareType(i) {
        //Empty function for moving opponent pieces, only allowing your pieces to be moved
        var movePieceFunction = this.props.squares[i] ? this.handleMovePiece : () => {};
        const pos = this.props.playerPath.indexOf(i) + 1;
        const relativePos = this.props.squares[i] ? this.props.playerPath.indexOf(i) + 1 : this.props.opponentPath.indexOf(i) + 1;

        var pieceClassName = boardStyles.squarePiece;
        if ((pos !== this.props.finishingPosition) && this.props.isPlayerTurn && this.props.rolled && this.props.moveablePositions.includes(pos) && !this.props.winnerId && !this.props.opponentSquares[i]) {
            pieceClassName = boardStyles.moveableSquarePiece;
            if ((this.props.rollNumber + pos) === this.props.finishingPosition) {
                pieceClassName = boardStyles.finishSquarePiece;
            }
        }
        if (this.state.powerUpActive && this.props.powerUpPieces.includes(i)) {
            pieceClassName = boardStyles.powerUpSquarePiece;
            movePieceFunction = this.usePowerUp;
        }
        var powerUpInfo = null;
        this.props.activePowerUps.forEach((activePowerUp) => {
            if((i !== 8) && (i !== 6) && activePowerUp.powerUp && (activePowerUp.squareIndex === i)) {
                powerUpInfo = activePowerUp;
            }
        });

        var displayNumber = null;
        if ((i === 8) && this.props.numPiecesFinished) {
            displayNumber = (this.props.numPiecesFinished > 1) ? this.props.numPiecesFinished : null;
        } else if ((i === 6) && this.props.numOppPiecesFinished) {
            displayNumber = (this.props.numOppPiecesFinished > 1) ? this.props.numOppPiecesFinished : null;
        }
        var powerUp = this.props.powerUps.includes(i);
        return (
            <Square index={i} position={relativePos} displayNumber={displayNumber} movePiece={movePieceFunction} piece={this.props.squares[i]} opponentPiece={this.props.opponentSquares[i]} pieceClassName={pieceClassName} powerUp={powerUp} setHighlightSquare={this.setHighlightSquare} highlight={(pos === this.state.highlightSquarePosition)} powerUpInfo={powerUpInfo} key={i} />
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
            cloak.message('movepiece', [position, this.props.moveId]);
        }
    }

    togglePowerUp(bool) {
        this.setState({
            powerUpActive: bool
        });
    }

    usePowerUp(position, opponentBool) {
        cloak.message('usepowerup', [position, this.props.moveId, opponentBool]);
        if ((this.props.powerUp !== "swap") || opponentBool) {
            this.togglePowerUp(false);
            document.body.style.cursor = "auto";
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
                } else if (this.state.powerUpActive && (this.props.powerUp === "push") && (this.props.powerUpPieces.length > 0) && !this.props.squares[this.props.playerPath[0]]) {
                    pieceHolder.push(<Piece position={pos} className={boardStyles.powerUpHolderPiece} movePiece={this.usePowerUp} setHighlightSquare={this.setHighlightSquare} key={i}/>);
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
            if (this.state.powerUpActive && (this.props.powerUp === "push") && (this.props.powerUpPieces.length > 0) && !(this.props.opponentSquares[this.props.opponentPath[0]])) {
                oppPieceHolder.push(<OpponentPiece movePiece={this.usePowerUp} className={boardStyles.powerUpHolderPiece} position={0} key={i}/>);
                continue;
            }
            oppPieceHolder.push(<OpponentPiece movePiece={() => {}} className={boardStyles.piece} key={i}/>)
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
        const useable = this.props.isPlayerTurn && ((!this.props.rollSequence && (this.props.powerUp !== "reroll"))  || (this.props.rolled && (this.props.powerUp === "reroll")));
        return (
            <div>
                <div className={boardStyles.boardMainDiv}>
                    {squareCols}
                </div>
                <div className={boardStyles.rollButton}>
                    {((this.props.rollNumber !== 'Roll' || this.props.rollSequence) && this.props.isPlayerTurn) ? rollSequenceNotClickable : rollSequenceClickable}
                </div>
                {this.props.enablePowerUps ? <PowerUp powerUp={this.props.powerUp} useable={useable} togglePowerUp={this.togglePowerUp}/> : null}
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
    moveId: state.game.moveId,
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
    powerUp: state.game.powerUp,
    enablePowerUps: state.game.enablePowerUps,
    powerUpPieces: state.game.powerUpPieces,
    activePowerUps: state.game.activePowerUps,
    playerPath: state.game.playerPath,
    opponentPath: state.game.opponentPath,
    finishingPosition: state.game.finishingPosition
});

export default connect(
    mapStateToProps
)(Board);
