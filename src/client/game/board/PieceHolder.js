import React, { Component } from 'react';
import boardStyles from './Board.css';
import { connect } from 'react-redux';
import Piece from './Piece';
export class PieceHolder extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const pieceHolder = [];
        for (var i = 0; i < this.props.numberOfPieces; i++) {
            const pos = this.props.piecePositions[i];
            if (pos === 0) {
                if (this.props.isPlayerTurn && this.props.rolled && this.props.moveablePositions.includes(pos) && !this.props.winnerId) {
                    pieceHolder.push(<Piece position={pos} className={boardStyles.moveablePiece} movePiece={this.props.handleMovePiece} setHighlightSquare={this.props.setHighlightSquare} key={i}/>);
                    continue;
                } else if (this.props.powerUpActive && (this.props.powerUp === "push") && (this.props.powerUpPieces.length > 0) && !this.props.squares[this.props.playerPath[0]]) {
                    pieceHolder.push(<Piece position={pos} className={boardStyles.powerUpHolderPiece} movePiece={this.props.usePowerUp} setHighlightSquare={this.props.setHighlightSquare} key={i}/>);
                    continue;
                }
                pieceHolder.push(<Piece position={pos} className={boardStyles.piece} movePiece={this.props.handleMovePiece} setHighlightSquare={this.props.setHighlightSquare} key={i}/>);
            }
        }

        return (
            <div>
                {pieceHolder}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    winnerId: state.game.winnerId,
    //Roll states
    rolled: state.game.rolled,
    //Game states
    numberOfPieces: state.game.numberOfPieces,
    squares: state.game.squares,
    piecePositions: state.game.piecePositions,
    moveablePositions: state.game.moveablePositions,
    powerUp: state.game.powerUp,
    powerUpPieces: state.game.powerUpPieces,
    playerPath: state.game.playerPath
});

export default connect(
    mapStateToProps
)(PieceHolder);
