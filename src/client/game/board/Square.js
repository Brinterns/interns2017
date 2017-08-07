import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import boardStyles from './Board.css';
import Piece from './Piece';
import OpponentPiece from './OpponentPiece';

const blankSquares = [6,8,9,11];
const rosettaSquares = [3,5,13,21,23];

export default class Square extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const i = this.props.index;
        var squareStyle = {};
        var highlightStyle = {};
        if (!blankSquares.includes(i)) {
            var picture =  require('../../images/board/boardsquares' + this.props.index + '.png');
            squareStyle = {
                background: 'url(' + picture + ')',
                backgroundSize: 'calc(6 * (1vw + 1vh - 1vmin))'
            }
        }
        if (this.props.index === 8) {
            var picture = require('../../images/board/finalsquare.png');
            highlightStyle = {
                background: 'url(' + picture + ')',
                backgroundSize: 'calc(5.4 * (1vw + 1vh - 1vmin))'
            }
        }
        return (
            <div className={boardStyles.square} style={squareStyle}>
                <div className={rosettaSquares.includes(i) ? boardStyles.rosetta : null}>
                    {this.props.piece ? <Piece displayNumber={this.props.displayNumber} setHighlightSquare={this.props.setHighlightSquare} position={this.props.position} className={this.props.pieceClassName} movePiece={this.props.movePiece}/> : null}
                    {this.props.opponentPiece ? <OpponentPiece displayNumber={this.props.displayNumber} className={boardStyles.squareOpponentPiece}/> : null}
                    {this.props.highlight ? <div className={boardStyles.moveHighlighter} style={highlightStyle} /> : null}
                </div>
            </div>
        );
    }
}
