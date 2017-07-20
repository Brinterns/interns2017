import React, { Component } from 'react';
import { browserHistory } from 'react-router';

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
        return (
            <div onMouseEnter onMouseEnter={this.enter} onMouseLeave={this.exit} className={this.props.className} onClick={this.movePiece}></div>
        );
    }


}
