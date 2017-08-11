import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import pieceStyles from './Board.css';

export default class Piece extends Component {
    constructor(props) {
        super(props);
        this.movePiece = this.movePiece.bind(this);
        this.enter = this.enter.bind(this);
        this.exit = this.exit.bind(this);
    }

    movePiece() {
        this.props.movePiece(this.props.position);

    }

    enter() {
        this.props.setHighlightSquare(this.props.position);
    }

    exit() {
        this.props.setHighlightSquare(null);
    }

    render() {
        var picture = require('../../images/board/playerpiece.png');
        const style = {
            background: 'url(' + picture + ')',
            backgroundSize: 'calc(5.4 * (1vw + 1vh - 1vmin))',
            backgroundRepeat: 'no-repeat'
        }
        return (
            <div onMouseEnter style={style} onMouseEnter={this.enter} onMouseLeave={this.exit} className={this.props.className} onClick={this.movePiece}>
                <h1 className={pieceStyles.displayNumber}> {this.props.displayNumber} </h1>
            </div>
        );
    }


}
