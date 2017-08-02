import React, { Component } from 'react';
import {emojify} from 'react-emojione';

/* list of emoji's sourced from http://getemoji.com */
const PEOPLE_EMOJIS = [":grinning:", ":smiley:", ":smile:", ":grin:", ":satisfied:", ":sweat_smile:", ":joy:", ":innocent:", ":rolling_on_the_floor_laughing:", ":relaxed:", ":blush:", ":slightly_smiling_face:", ":upside_down_face:", ":wink:", ":relieved:", ":heart_eyes:", ":kissing_heart:", ":kissing:", ":kissing_smiling_eyes:", ":kissing_closed_eyes:", ":yum:", ":stuck_out_tongue_winking_eye:", ":stuck_out_tongue_closed_eyes:", ":stuck_out_tongue:", ":money_mouth_face:", ":hugging_face:", ":nerd_face:", ":sunglasses:", ":clown_face:", ":face_with_cowboy_hat:", ":smirk:", ":unamused:", ":disappointed:", ":pensive:", ":worried:", ":confused:", ":slightly_frowning_face:", ":white_frowning_face:", ":persevere:", ":confounded:", ":tired_face:", ":weary:", ":triumph:", ":angry:", ":rage:", ":no_mouth:", ":neutral_face:", ":expressionless:", ":hushed:", ":frowning:", ":anguished:", ":open_mouth:", ":astonished:", ":dizzy_face:", ":flushed:", ":scream:", ":fearful:", ":cold_sweat:", ":cry:", ":disappointed_relieved:", ":drool:", ":sob:", ":sweat:", ":sleepy:", ":sleeping:", ":face_with_rolling_eyes:", ":thinking_face:", ":liar:", ":grimacing:", ":zipper_mouth_face:", ":sick:", ":sneeze:", ":mask:", ":face_with_thermometer:", ":face_with_head_bandage:", ":smiling_imp:", ":imp:", ":japanese_ogre:", ":japanese_goblin:", ":poo:", ":ghost:", ":skeleton:", ":skull_and_crossbones:", ":alien:", ":space_invader:", ":robot_face:", ":jack_o_lantern:", ":smiley_cat:"]

export default class EmojiPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emojis: PEOPLE_EMOJIS
        };
    }

    render() {
        const emojiDisp = this.state.emojis.map(function(emoji, index){
            return <h1 key={index}>{emojify(emoji)}</h1>
        });
        return (
            <div>
                {emojiDisp}
            </div>
        );
    }
}
