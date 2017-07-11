import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import boardStyles from './Board.css';
import Piece from './Piece';
import Square from './Square';

const rosettaSquares = [3,5,13,21,23];
const blankSquares = [6,8,9,11];

export default class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(24).fill(false)
        };
        {this.temp()};
        this.onClick = this.onClick.bind(this);
        this.squareType = this.squareType.bind(this);
    }

    temp() {
        let arrayS = this.state.squares;
        arrayS[21] = true;
        this.setState({
            squares: arrayS
        });
    }

    squareType(i) {
        let className = boardStyles.squareNormal;
        if (rosettaSquares.includes(i)) {
            className = boardStyles.squareRosetta;
        } else if (blankSquares.includes(i)) {
            className = boardStyles.squareBlank;
        }
        return (
            <Square piece={this.state.squares[i]} className={className} key={i} />
        );
    }

    onClick() {
        if (this.props.isPlayerTurn && !this.props.rolled) {
            this.props.rolledCb();
            cloak.message('rolldice', _);
        }
    }

    render() {
        const numOfPlaceHolderPieces = 7;
        const pieceHolder = [];
        const squareCols = [];
        for(var i = 0; i < numOfPlaceHolderPieces; i++) {
            pieceHolder.push(<Piece className={boardStyles.piece} key={i}/>);
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
