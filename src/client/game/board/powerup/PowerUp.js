import React, { Component } from 'react';
import powerUpStyles from './PowerUp.css';

export default class PowerUp extends Component {
    constructor(props) {
        super(props);
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
            <div className={powerUpStyles.powerUpDiv}>
                <div className={this.props.useable ? powerUpStyles.powerClickable : powerUpStyles.powerUnclickable} style={powerUpStyle}/>
            </div>
        );
    }
}
