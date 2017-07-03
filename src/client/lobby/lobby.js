import React, { Component } from 'react';

import config from '../config/config';

export default class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: false
        };
        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        const ready = !this.state.ready;
        cloak.message('userready', ready);
        this.setState({
            ready: ready
        });
    }

    render() {
        return (
            <div>
                <h1>Lobby</h1>
                <button onClick={this.onClick}>{this.state.ready ? "Unready" : "Ready"}</button>
            </div>
        );
    }
};
