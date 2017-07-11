import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import boardStyles from './Board.css';
import Piece from './Piece';



const squareN = boardStyles.squareNormal;
const squareR = boardStyles.squareRosetta;
const squareB = boardStyles.squareBlank;

export default class Board extends Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.squareColumn = this.squareColumn.bind(this);
        this.handleMovePiece = this.handleMovePiece.bind(this);
    }

    squareColumn(class1, class2, class3) {
        return (
            <div className={boardStyles.squaresColumn}>
                <div className={class1} />
                <div className={class2} />
                <div className={class3} />
            </div>
        );
    }

    onClick() {
        if (this.props.isPlayerTurn && !this.props.rolled) {
            this.props.rolledCb();
            cloak.message('rolldice', _);
        }
    }

    handleMovePiece() {
        if (this.props.isPlayerTurn && this.props.rolled) {
            console.log("Piece clicked");
            cloak.message('endturn', _);
        }
    }

    render() {
        const numOfPlaceHolderPieces = 7;
        const pieceHolder = [];
        for(var i = 0; i < numOfPlaceHolderPieces; i++) {
            pieceHolder.push(<Piece movePiece={this.handleMovePiece}/>);
        }


        return (
                <div>
                    <div className={boardStyles.boardMainDiv}>
                        {this.squareColumn(squareN,squareN,squareN)}
                        {this.squareColumn(squareR,squareN,squareR)}
                        {this.squareColumn(squareB,squareN,squareB)}
                        {this.squareColumn(squareB,squareN,squareB)}
                        {this.squareColumn(squareN,squareR,squareN)}
                        {this.squareColumn(squareN,squareN,squareN)}
                        {this.squareColumn(squareN,squareN,squareN)}
                        {this.squareColumn(squareR,squareN,squareR)}
                    </div>
                    <button onClick={this.onClick} className={boardStyles.rollButton}>{this.props.rollNumber}</button>
                    <div className={boardStyles.pieceHolder}>
                        {pieceHolder}
                    </div>
                </div>
        );
    }
}
