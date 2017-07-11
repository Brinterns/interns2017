import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import boardStyles from './Board.css';
import Piece from './Piece';
import Square from './Square';

const rosettaSquares = [3,5,13,21,23];
const blankSquares = [6,8,9,11];
const numberOfPieces = 7;

const playerPath = [
    14,  17,  20,  23,
    22,  19,  16,  13,
    10,  7,  4,  1,
    2,  5
];

export default class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(24).fill(false),
            piecePositions: Array(numberOfPieces).fill(0),
            numPiecesFinished: 0
        };
        this.onClick = this.onClick.bind(this);
        this.squareType = this.squareType.bind(this);
        this.handleMovePiece = this.handleMovePiece.bind(this);
        this.canMove = this.canMove.bind(this);
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
            var nextPos = (position + rollNumberInt);
            if (!(this.canMove(position, rollNumberInt, squares, nextPos))) {
                return;
            }
            squares[playerPath[nextPos-1]] = true;
            if (position !== 0) {
                squares[playerPath[position-1]] = false;
            }
            if (nextPos === 15) {
                nextPos = -1;
                const numPiecesFinished = this.state.numPiecesFinished + 1;
                this.setState({
                    numPiecesFinished: numPiecesFinished
                });
                if (numPiecesFinished === numberOfPieces) {
                    this.props.onWin(true);
                }
            }
            var piecePositions = this.state.piecePositions;
            piecePositions[this.state.piecePositions.indexOf(position)] = nextPos;
            this.setState({
                squares: squares,
                piecePositions: piecePositions
            });
            if (rosettaSquares.includes(playerPath[position+rollNumberInt-1])) {
                this.props.reRoll();
                return;
            }
            cloak.message('endturn', _);
        }
    }

    canMove(position, rollNumberInt, squares, nextPos) {
        var nextPos = (position + rollNumberInt);
        if (squares[playerPath[position+rollNumberInt-1]] || (nextPos > 15)) {
            return false;
        }
        return true;
    }


    render() {
        if (this.props.rolled && this.props.isPlayerTurn) {
            const rollNumberInt = parseInt(this.props.rollNumber);
            var squares = this.state.squares;
            const numNotMoveable = this.state.piecePositions.filter((position) => {
                var nextPos = (position + rollNumberInt);
                return ((position === -1) || !this.canMove(position, rollNumberInt, squares, nextPos));
            }).length;
            if (numNotMoveable === numberOfPieces) {
                cloak.message('endturn', _);
            }
        }

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
                    <h3>Finished pieces: {this.state.numPiecesFinished}</h3>
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
