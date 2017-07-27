import React, { Component } from 'react';
import chatStyles from './Chat.css';
import send from '../images/icons/send.png';
import message from '../images/icons/msg.png';

export default class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
            showChat: false,
            numMsgSeen: this.props.messages.length
        };
        setTimeout(() => {
            this.setState({ numMsgSeen: this.props.messages.length});
        }, 500);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleKeyPress(e) {
        if(e.key === 'Enter') {
            this.sendMessage();
        }
    }

    sendMessage() {
        cloak.message('sendmessage', this.state.input);
        this.setState({
            input: ''
        });
        document.getElementById("msginput").value = '';
    }

    handleClick() {
        this.setState({
            showChat: !this.state.showChat
        });
        //when chat gets closed, update last num messages seen
        if (this.state.showChat) {
            this.setState({
                numMsgSeen: this.props.messages.length
            });
        }
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
            }, 25);
        }
    }

    render() {
        const messages = this.props.messages;
        const messageDisplay = (
            messages.map((messageData, i) => {
                    {this.scrollToBottom()}
                    if(messageData.userId === this.props.id) {
                        return(
                            <div key={i} className={chatStyles.playerMesssge}>
                                <div className={chatStyles.message}>
                                    <h3>{messageData.message}</h3>
                                </div>
                            </div>
                        );
                    }
                    return(
                        <div className={chatStyles.opponentMessage} key={i}>
                            <h5>{messageData.message}</h5>
                            <h4>{messageData.userName}</h4>
                        </div>
                    );
            })
        );
        const difference = this.props.messages.length - this.state.numMsgSeen;
        const msgNotifier = (
            <div className={chatStyles.chatNotifier}>
                <p>{difference}</p>
            </div>
        );
        const closedChatClass = (difference > 0) ? chatStyles.notifyMain : "";

        const closedChatDiv = (
            <div onClick={this.handleClick} className={chatStyles.closedChat}>
                <div className={closedChatClass}>
                    <img src={message} />
                    <p>Chat</p>
                    {difference > 0 ? msgNotifier : null }
                </div>
            </div>
        );

        const openChatDiv = (
            <div className={chatStyles.openChat}>
                <div onClick={this.handleClick} className={chatStyles.openChatTop}>
                    <img src={message} />
                    <p>Chat </p>
                </div>
                <div id="messagediv" className={chatStyles.messages}>
                    {messageDisplay}
                </div>
                <div className={chatStyles.openChatBottom}>
                    <input id="msginput" type="text" placeholder="Type your message..." onKeyPress={this.handleKeyPress} value={this.state.input} onChange={this.handleChange}/>
                    <img src={send} onClick={this.sendMessage}/>
                </div>
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
