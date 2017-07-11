import React, { Component } from 'react';
import { browserHistory } from 'react-router';

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
            <div className={this.props.className} onClick={this.movePiece}></div>
        );
    }


}
