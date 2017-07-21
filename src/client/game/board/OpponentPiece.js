import React, { Component } from 'react';
import { browserHistory } from 'react-router';

export default class OpponentPiece extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className={this.props.className}></div>
        );
    }
}
