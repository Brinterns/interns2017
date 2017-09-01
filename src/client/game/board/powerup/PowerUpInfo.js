import React, { Component } from 'react';
import powerUpStyles from './PowerUp.css';
import info from '../../../images/powerups/info.png';
import infohover from '../../../images/powerups/infohover.png';
import pull from '../../../images/powerups/pull.png';
import boot from '../../../images/powerups/boot.png';
import push from '../../../images/powerups/push.png';
import shield from '../../../images/powerups/shield.png';
import swap from '../../../images/powerups/swap.png';
import reroll from '../../../images/powerups/reroll.png';
import remoteattack from '../../../images/powerups/remoteattack.png';
import ghost from '../../../images/powerups/ghost.png';

export default class PowerUpInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            infoDisplay: false
        }
        this.toggleDisplay = this.toggleDisplay.bind(this);
    }

    toggleDisplay() {
        this.setState({
            infoDisplay: !this.state.infoDisplay
        });
    }

    getPowerUpInfo(image, info) {
        return (
            <div className={powerUpStyles.powerUpInfo}>
                <img src={image} />
                <p>{info}</p>
            </div>
        )
    }

    render() {
        return (
            <div>
                <img className={powerUpStyles.infoImg} src={this.state.infoDisplay ? infohover : info } onMouseEnter={this.toggleDisplay} onMouseLeave={this.toggleDisplay}/>
                {this.state.infoDisplay ?
                    <div className={powerUpStyles.infoDropDown}>
                        <p>(Common)</p>
                        {this.getPowerUpInfo(push, "Push any valid piece one square forwards")}
                        {this.getPowerUpInfo(pull, "Pull any valid piece one square backwards")}
                        {this.getPowerUpInfo(shield, "Protect a piece from being jumped or remote attacked, lasts for 3 turns or until the piece is attacked")}
                        {this.getPowerUpInfo(swap, "Swap one of your pieces with an opposing piece (war-zone only)")}
                        {this.getPowerUpInfo(reroll, "Allows another roll, automatically applied if no moves are available")}
                        <p>(Rare)</p>
                        {this.getPowerUpInfo(boot, "No restrictions on moves, attacks all pieces that are jumped over")}
                        {this.getPowerUpInfo(remoteattack, "Target any opponent piece on the board")}
                        {this.getPowerUpInfo(ghost, "Hide all pieces from the opponent for 3 turns, does not offer protection")}
                    </div>
                    : null
                }
            </div>
        );
    }
}
