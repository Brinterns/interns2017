import React, { Component } from 'react';
import powerUpStyles from './PowerUp.css';
import PowerUpInfo from './PowerUpInfo';

export default class PowerUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            powerUpClicked: false
        }
        this.togglePowerUp = this.togglePowerUp.bind(this);
        document.addEventListener('click', this.pageClick.bind(this), true);
    }

    pageClick(e) {
        if (e.target.id !== "powerup") {
            document.body.style.cursor = "auto";
            if (this.refs.powerup) {
                if (e.target.id !== "piece") {
                    this.props.togglePowerUp(false);
                }
                this.setState({
                    powerUpClicked: false
                });
            }
        }
    }

    togglePowerUp() {
        if (!this.props.useable || !this.props.powerUp) {
            return;
        }
        if (!this.state.powerUpClicked) {
            var picture = require('../../../images/powerups/cursors/'+ this.props.powerUp +'.png');
            document.body.style.cursor = "url('" + picture + "'), auto";
            cloak.message('activatepowerup', this.props.powerUp);
        } else {
            document.body.style.cursor = "auto";
        }
        this.props.togglePowerUp(!this.state.powerUpClicked);
        this.setState({
            powerUpClicked: !this.state.powerUpClicked
        });
    }

    render() {
        var powerUpStyle;
        if (this.props.powerUp) {
            var picture = require('../../../images/powerups/'+ this.props.powerUp +'.png');
            powerUpStyle = {
                background: 'url(' + picture + ')',
                backgroundRepeat: 'no-repeat'
            }
        }

        return (
            <div ref="powerup" className={powerUpStyles.powerUpDiv}>
                <div id="powerup" className={(this.props.useable && this.props.powerUp) ? powerUpStyles.powerClickable : powerUpStyles.powerUnclickable} style={powerUpStyle} onClick={this.togglePowerUp} />
                <PowerUpInfo />
            </div>
        );
    }
}
