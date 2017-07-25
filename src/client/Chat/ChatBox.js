import React, { Component } from 'react';
import chatStyles from './Chat.css';

export default class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
            showChat: false
        };
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);

        this.handleClick = this.handleClick.bind(this);
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

    handleClick() {
        this.setState({
            showChat: !this.state.showChat
        });
    }


    handleChange(e) {
        this.setState ({
            input: e.target.value
        });
    }

    scrollToBottom() {
        var messagesDiv = document.getElementById("messagediv");
        if (messagesDiv) {
            messagesDiv.scrollTop  = messagesDiv.scrollHeight;
        } else {
            setTimeout(() => {
                messagesDiv = document.getElementById("messagediv");
                if (messagesDiv) {
                    messagesDiv.scrollTop  = messagesDiv.scrollHeight;
                }
            }, 10);
        }
    }

    render() {
        const messages = this.props.messages;
        const messageDisplay = (
            messages.map((messageData, i) => {
                    if (i === messages.length - 1) {
                        {this.scrollToBottom()}
                    }
                    if(messageData.userId === this.props.id) {
                        return(
                            <div key={i} className={chatStyles.container}>
                                <div className={chatStyles.message}>
                                    <h3>{messageData.message}</h3>
                                </div>
                            </div>
                        );
                    }
                    return(
                        <div className={chatStyles.message} key={i}>
                            <h4>{messageData.userName}: </h4>
                            <h5>{messageData.message}</h5>
                        </div>
                    );
            })
        );
        const closedChatDiv = (
            <div onClick={this.handleClick} className={chatStyles.closedChat}>
                <p>Chat </p>
            </div>
        );

        const openChatDiv = (
            <div className={chatStyles.openChat}>
                <div onClick={this.handleClick} className={chatStyles.openChatTop}>
                    <p>Chat </p>
                </div>
                <div id="messagediv" className={chatStyles.messages}>
                    {messageDisplay}
                </div>
                <input type="text" onKeyPress={this.handleKeyPress} value={this.state.input} onChange={this.handleChange}/>
            </div>
        );
        const divToDisplay = this.state.showChat ? openChatDiv : closedChatDiv;

        return (
            <div>
                {divToDisplay}
            </div>
        );
    }
}
