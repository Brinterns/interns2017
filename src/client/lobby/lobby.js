import React, { Component } from 'react';

import config from '../config/config';

export default class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Ready",
            ready: false
        };
        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        const ready = !this.state.ready;
        const title = this.state.ready ? "Ready" : "Unready";
        cloak.message('userready', ready);
        this.setState({
            title: title,
            ready: ready
        });
    }

    render() {
        return (
            <div>
                <h1>Lobby</h1>
                <button onClick={this.onClick}>{this.state.title}</button>
            </div>
        );
    }
};
