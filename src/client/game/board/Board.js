import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import boardStyles from './Board.css';
import Piece from './Piece';
import Square from './Square';

const rosettaSquares = [3,5,13,21,23];
const blankSquares = [6,8,9,11];

const playerPath = [
    14,  17,  20,  23,
    22,  19,  16,  13,
    10,  7,  4,  1,
    2,  5
];

export default class Board extends Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.squareType = this.squareType.bind(this);
        this.handleMovePiece = this.handleMovePiece.bind(this);
    }

    squareType(i) {
        let className = boardStyles.squareNormal;
        if (rosettaSquares.includes(i)) {
            className = boardStyles.squareRosetta;
        } else if (blankSquares.includes(i)) {
            className = boardStyles.squareBlank;
        }
        return (
            <Square position={(playerPath.indexOf(i)+1)}  movePiece={this.handleMovePiece} piece={this.props.squares[i]} className={className} key={i} />
        );
    }

    onClick() {
        if (this.props.isPlayerTurn && !this.props.rolled) {
            this.props.rolledCb();
            cloak.message('rolldice', _);
        }
    }

    handleMovePiece(position) {
        if (this.props.isPlayerTurn && this.props.rolled && this.props.moveablePositions.includes(position)) {
            cloak.message('movepiece', position);
        }
    }

    render() {
        const pieceHolder = [];
        const squareCols = [];
        for(var i = 0; i < 7; i++) {
            if (this.props.piecePositions[i] === 0) {
                pieceHolder.push(<Piece position={this.props.piecePositions[i]} className={boardStyles.piece} movePiece={this.handleMovePiece} key={i}/>);
            }
        }
        for(var i = 0; i < 24; i += 3) {
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
                    <h3>Finished pieces: {this.props.numPiecesFinished}</h3>
                    <div className={boardStyles.boardMainDiv}>
                        {squareCols}
                    </div>
                    <button onClick={this.onClick} className={boardStyles.rollButton}>{this.props.rollNumber}</button>
                    <div className={boardStyles.pieceHolder}>
                        {pieceHolder}
                    </div>
                </div>
        );
    }
}
