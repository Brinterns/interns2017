import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import pieceStyles from './Board.css';

export default class OpponentPiece extends Component {
    constructor(props) {
        super(props);
        this.movePiece = this.movePiece.bind(this);
    }

    movePiece() {
        this.props.movePiece(this.props.position, true);
    }

    render() {
        var picture = require('../../images/board/opponentpiece.png');
        var style = {
            background: 'url(' + picture + ')',
            backgroundRepeat: 'no-repeat'
        }
        style.backgroundSize = this.props.minimap ? 'calc(2.7 * (1vw + 1vh - 1vmin))' : 'calc(5.4 * (1vw + 1vh - 1vmin))';
        return (
            <div id="piece" className={this.props.className} style={style} onClick={this.movePiece}>
                <h1 className={this.props.minimap ? pieceStyles.displayNumberMiniMap : pieceStyles.displayNumber}> {this.props.displayNumber} </h1>
            </div>
        );
    }
}
