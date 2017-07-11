import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import pieceStyles from './Board.css';

export default class Piece extends Component {
    constructor(props) {
        super(props);
        this.movePiece = this.movePiece.bind(this);
    }

    movePiece() {
        this.props.movePiece();
    }

    render() {
        return (
            <div className={pieceStyles.piece} onClick={this.movePiece}></div>
        );
    }


}
