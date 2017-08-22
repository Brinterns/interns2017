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
        var style = {
            background: 'url(' + picture + ')',
            backgroundRepeat: 'no-repeat'
        }
        style.backgroundSize = this.props.minimap ? 'calc(2.7 * (1vw + 1vh - 1vmin))' : 'calc(5.4 * (1vw + 1vh - 1vmin))';
        return (
            <div id="piece" onMouseEnter style={style} onMouseEnter={this.enter} onMouseLeave={this.exit} className={this.props.className} onClick={this.movePiece}>
                <h1 className={this.props.minimap ? pieceStyles.displayNumberMiniMap : pieceStyles.displayNumber}> {this.props.displayNumber} </h1>
            </div>
        );
    }


}
