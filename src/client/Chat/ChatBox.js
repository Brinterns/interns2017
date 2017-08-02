import React, { Component } from 'react';
import chatStyles from './Chat.css';
import send from '../images/icons/send.png';
import message from '../images/icons/msg.png';
import emoji from '../images/icons/emoji.png';
import Picker from '../mod/emojipicker/lib/Picker';
import {emojify} from 'react-emojione';
import emojione from 'emojione';
import emojidictionary from './emojidictionary.json';

export default class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
            showChat: false,
            numMsgSeen: this.props.messages.length,
            emojis: false
        };
        setTimeout(() => {
            this.setState({ numMsgSeen: this.props.messages.length});
        }, 500);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.toggleEmojis = this.toggleEmojis.bind(this);
    }

    handleKeyPress(e) {
        if(e.key === 'Enter') {
            this.sendMessage();
        }
    }

    sendMessage() {
        if (!(this.state.input).replace(/\s/g, '').length) {
            return;
        }
        cloak.message('sendmessage', this.state.input);
        this.setState({
            input: '',
            emojis: false
        });
        var input = document.getElementById("msginput");
        if (input) {
            input.value = '';
        }
        setTimeout(()=>{this.scrollToBottom()},1000);
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

    toggleEmojis() {
        this.setState({
            emojis: !this.state.emojis
        });
    }

    addEmoji (emoji) {
        this.setState({
            input: this.state.input + emoji.shortname
        });
        emojidictionary.emojis.forEach((emoji_d) => {
            if (emoji_d.name === emoji.shortname) {
                this.setState({
                    input: this.state.input + emoji_d.unicode
                });
                return;
            }
        });
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
                                    <h3>{emojify(messageData.message)}</h3>
                                </div>
                            </div>
                        );
                    }
                    const canvasId = "msgcanvas" + i;
                    setTimeout (() => {
                        var myCanvas = document.getElementById(canvasId);
                        if (myCanvas) {
                            var ctx = myCanvas.getContext('2d');
                            var img = new Image;
                            img.onload = function(){
                              ctx.drawImage(img, 0, 0, 300, 150);
                            };
                            img.src = messageData.avatar;
                        }
                        if (i === (messages.length - 1)) {
                            {this.scrollToBottom()}
                        }
                    }, 50);
                    return(
                        <div key={i} className={chatStyles.opponent}>
                            <canvas id={canvasId} className={chatStyles.avatar}/>
                            <div className={chatStyles.opponentMessage}>
                                <h5>{emojify(messageData.message)}</h5>
                                <h4>{messageData.userName}</h4>
                            </div>
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
                    {this.state.emojis ? <Picker onEmojiSelected={this.addEmoji.bind(this)} /> : messageDisplay}
                </div>
                <div className={chatStyles.openChatBottom}>
                    <div className={chatStyles.inputArea}>
                        <input id="msginput" type="text" placeholder="Type your message..." onKeyPress={this.handleKeyPress} value={this.state.input} onChange={this.handleChange}/>
                        <img src={emoji} onClick={this.toggleEmojis}/>
                    </div>
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
