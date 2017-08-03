import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import pieceStyles from './Board.css';

export default class OpponentPiece extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className={this.props.className}>
                <h1 className={pieceStyles.displayNumber}> {this.props.displayNumber} </h1>
            </div>
        );
    }
}
