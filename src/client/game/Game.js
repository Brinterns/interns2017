import React, { Component } from 'react';

export default class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            listOfPlayers: []
        };
        cloak.configure({
            messages: {
                updateplayers: (userinfo) => {
                    this.setState({
                        listOfPlayers: JSON.parse(userinfo)
                    });
                },
                userid: (id) => {
                    this.setState({
                        id: id
                    });
                }
            }
        });
        {this.getGameInfo()};
    }

    getGameInfo() {
        cloak.message('getroominfo',_);
    }

    render() {
        return (
            <div>
                <h1> Game </h1>
            </div>
        );
    }
}