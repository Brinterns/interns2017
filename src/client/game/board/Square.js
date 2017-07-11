import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import boardStyles from './Board.css';
import Piece from './Piece';

export default class Square extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.className}>
                {this.props.piece ? <Piece className={boardStyles.squarePiece}/> : null}
            </div>
        );
    }
}
