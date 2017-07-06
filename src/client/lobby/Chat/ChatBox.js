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
            input: event.target.value
        });
    }
    render() {
        const messageData = this.props.messages;
        const messageDisplay = (
            this.props.messages.map((messageData, i) => {
                return (
                    <div key={i} className={chatStyles.messagesDiv}>
                        <h3>{messageData.userName}: </h3>
                        <h4>&nbsp;&nbsp;{messageData.message}</h4>
                    </div>
                )
            })
        );
        return (
            <div className={chatStyles.chatMain}>
                {messageDisplay}
                <input type="text" onKeyPress={this.handleKeyPress} onChange={this.handleChange}/>
            </div>
        );
    }
}
