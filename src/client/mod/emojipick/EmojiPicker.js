import React, { Component } from 'react';
import {emojify} from 'react-emojione';
import emojiStyles from './EmojiPicker.css';

/* list of emoji's sourced from http://getemoji.com */
const PEOPLE_EMOJIS = [":grinning:", ":smiley:", ":smile:", ":grin:", "😆", ":sweat_smile:", ":joy:", ":innocent:", "🤣", ":relaxed:", ":blush:", "🙂", "🙃", ":wink:", ":relieved:", ":heart_eyes:", ":kissing_heart:", ":kissing:", ":kissing_smiling_eyes:", ":kissing_closed_eyes:", ":yum:", ":stuck_out_tongue_winking_eye:", ":stuck_out_tongue_closed_eyes:", ":stuck_out_tongue:", "🤑", "🤗", "🤓", ":sunglasses:", "🤡", "🤠", ":smirk:", ":unamused:", ":disappointed:", ":pensive:", ":worried:", ":confused:", ":persevere:", ":confounded:", ":tired_face:", ":weary:", ":triumph:", ":angry:", ":rage:", ":no_mouth:", ":neutral_face:", ":expressionless:", ":hushed:", ":frowning:", ":anguished:", ":open_mouth:", ":astonished:", ":dizzy_face:", ":flushed:", ":scream:", ":fearful:", ":cold_sweat:", ":cry:", ":disappointed_relieved:", "🤤", ":sob:", ":sweat:", ":sleepy:", ":sleeping:", ":grimacing:", "🤢", "🤧", ":mask:", "🤒", "🤕", ":smiling_imp:", ":imp:", ":japanese_ogre:", ":japanese_goblin:", "💩", ":ghost:", "💀", "☠", ":alien:", ":space_invader:", "🤖", ":jack_o_lantern:", ":smiley_cat:"]

const OBJECT_EMOJIS = [];

const FOOD_EMOJIS = [];

const SPORT_EMOJIS = [];

const SYMBOL_EMOJIS = [];

const TRAVEL_EMOJIS = [];

const CATEOGRY_PICKERS = [':grinning:', '🦊', '🍔', '⚽', '✈', '❤'];
const EMOJI_CATEOGRIES = [PEOPLE_EMOJIS, OBJECT_EMOJIS, FOOD_EMOJIS, SPORT_EMOJIS, TRAVEL_EMOJIS, SYMBOL_EMOJIS];

export default class EmojiPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emojis: PEOPLE_EMOJIS
        };
        this.chosenCategory = this.chosenCategory.bind(this);
    }

    chosenCategory(bool, emoji, i, category) {
        if (bool) {
            return <h2 key={i} onClick={() => this.setState({emojis:category})}>{emojify(emoji)}</h2>
        }
        return <h1 key={i} onClick={() => this.setState({emojis:category})}>{emojify(emoji)}</h1>
    }

    render() {
        const emojiDisplay = this.state.emojis.map((emoji, index) => {
            return <h1 onClick={() => {this.props.onEmojiSelected(emoji)}} key={index}>{emojify(emoji)}</h1>
        });
        const categoryPicker = (
            <div className={emojiStyles.categoryPicker}>
                {CATEOGRY_PICKERS.map((emoji, i) => {
                    const bool = (EMOJI_CATEOGRIES[i] === this.state.emojis);
                    return this.chosenCategory(bool, emoji, i, EMOJI_CATEOGRIES[i]);
                })}
            </div>
        );

        return (
            <div>
                {categoryPicker}
                <div className={emojiStyles.emojiDisplay}>
                    {emojiDisplay}
                </div>
            </div>
        );
    }
}
