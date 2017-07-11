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
]

const opponentPath = {
    1: 12,  2: 15,  3: 18,  4: 21,
    5: 22,  6: 19,  7: 16,  8: 13,
    9: 10,  10: 7,  11: 4,  12: 1,
    13: 0,  14: 3
}



export default class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(24).fill(false),
            piecePositions: Array(7).fill(0)
        };
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
            <Square position={(playerPath.indexOf(i)+1)}  movePiece={this.handleMovePiece} piece={this.state.squares[i]} className={className} key={i} />
        );
    }

    onClick() {
        if (this.props.isPlayerTurn && !this.props.rolled) {
            this.props.rolledCb();
            cloak.message('rolldice', _);
        }
    }

    handleMovePiece(position) {
        if (this.props.isPlayerTurn && this.props.rolled) {
            const rollNumberInt = parseInt(this.props.rollNumber);
            var squares = this.state.squares;
            squares[playerPath[position+rollNumberInt-1]] = true;
            if (position !== 0) {
                squares[playerPath[position-1]] = false;
            }
            var piecePositions = this.state.piecePositions;
            piecePositions[this.state.piecePositions.indexOf(position)] = position + rollNumberInt;
            this.setState({
                squares: squares,
                piecePositions: piecePositions
            });
            cloak.message('endturn', _);
        }
    }

    render() {
        console.log(this.state.squares);
        console.log(this.state.piecePositions);
        const pieceHolder = [];
        const squareCols = [];
        for(var i = 0; i < 7; i++) {
            if (this.state.piecePositions[i] === 0) {
                pieceHolder.push(<Piece position={this.state.piecePositions[i]} className={boardStyles.piece} movePiece={this.handleMovePiece} key={i}/>);
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
