import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import pieceStyles from './Board.css';

export default class Piece extends Component {
    render() {
        return (
            <div className={pieceStyles.piece}></div>
        );
    }


}
