import React, { Component } from 'react';
import chatStyles from './Chat.css';

export default class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: ''
        };
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleKeyPress(e) {
        if(e.key === 'Enter') {
            cloak.message('sendmessage', e.target.value);
            e.target.value = '';
            this.setState({
                input: ''
            });
        }
    }

    handleChange(e) {
        this.setState ({
            input: e.target.value
        });
    }

    render() {
        const messageData = this.props.messages;
        const messageDisplay = (
            messageData.map((messageData, i) => {
                return (
                    <div key={i} className={chatStyles.messagesDiv}>
                        <h1>{messageData.userName}: </h1>
                        <h2>&nbsp;&nbsp;{messageData.message}</h2>
                    </div>
                )
            })
        );
        return (
            <div className={chatStyles.chatMain}>
                <div className={chatStyles.sentMessages}>
                    {messageDisplay}
                </div>
                <input type="text" onKeyPress={this.handleKeyPress} value={this.state.input} onChange={this.handleChange}/>
            </div>
        );
    }
}
