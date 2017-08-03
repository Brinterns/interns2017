import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import boardStyles from './Board.css';
import Piece from './Piece';
import OpponentPiece from './OpponentPiece';

export default class Square extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className={this.props.className}>
                {this.props.piece ? <Piece displayNumber={this.props.displayNumber} setHighlightSquare={this.props.setHighlightSquare} position={this.props.position} className={this.props.pieceClassName} movePiece={this.props.movePiece}/> : null}
                {this.props.opponentPiece ? <OpponentPiece displayNumber={this.props.displayNumber} className={boardStyles.squareOpponentPiece}/> : null}
                {this.props.highlight ? <div className={boardStyles.moveHighlighter}/> : null}
            </div>
        );
    }
}
