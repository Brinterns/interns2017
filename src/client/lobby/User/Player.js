import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import userStyles from '../Lobby.css';


export default class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: false,
            input: ''
        }
        document.addEventListener('click', this.pageClick.bind(this), true);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    pageClick(e) {
        if(e.target.id === "usernameinput") {
            return;
        }
        this.setState({
            clicked: false
        });
    }

    handleClick() {
        this.setState({
            clicked: !this.state.clicked,
            input: this.props.name
        });
    }

    handleKeyPress(e) {
        if(e.key === 'Enter') {
            this.setState({
                clicked: false
            });
            cloak.message('setusername', this.state.input);
        }
    }

    handleChange(e) {
        this.setState({
            input: e.target.value
        });
    }

    render() {
        return (
            <div>
                {this.state.clicked ? <input id="usernameinput" onKeyPress={this.handleKeyPress} onChange={this.handleChange}value={this.state.input}/> : <h1 onClick={this.handleClick}> {this.props.name} </h1>}
            </div>
        );
    }
}
