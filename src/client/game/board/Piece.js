import React, { Component } from 'react';
import { browserHistory } from 'react-router';

export default class Piece extends Component {
    render() {
        return (
            <div className={this.props.className}></div>
        );
    }


}
