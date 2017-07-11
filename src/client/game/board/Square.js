import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import boardStyles from './Board.css';
import Piece from './Piece';

export default class Square extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.piece) {
            console.log(this.props.position + " is a piece on a square");
        }
        return (
            <div className={this.props.className}>
                {this.props.piece ? <Piece position={this.props.position} className={boardStyles.squarePiece} movePiece={this.props.movePiece}/> : null}
            </div>
        );
    }
}
