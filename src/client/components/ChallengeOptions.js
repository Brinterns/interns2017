import React, { Component } from 'react';
import optionsStyles from './Components.css';
import powerups from '../images/icons/powerups.png';
import powerupsactive from '../images/icons/powerupsactive.png';

export default class ChallengeOptions extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        if ((event.target.id === "minus") && (this.props.numberOfPieces > 1)) {
            this.props.onChange(this.props.numberOfPieces - 1);
        } else if ((event.target.id === "plus") && (this.props.numberOfPieces < 9)) {
            this.props.onChange(this.props.numberOfPieces + 1);
        }
    }

    render() {
        var parentStyle;
        if (this.props.lobby) {
            parentStyle = {
                float: 'right',
                marginTop: 'calc(0.1 * (1vw + 1vh - 1vmin))'
            }
        } else {
            parentStyle = {
                height: 'calc(2.5 * (1vw + 1vh - 1vmin))',
                minHeight: '25px',
                marginBottom: 'calc(0.4 * (1vw + 1vh - 1vmin))'
            }
        }

        return (
            <div className={optionsStyles.numberOfPieces} style={parentStyle}>
                {(!this.props.inChallenge) ?  <button id="minus" title="Decrease no. of pieces" onClick={this.onChange}> - </button> : null}
                {(this.props.inChallenge) ?
                    <label title="No. of pieces" className={optionsStyles.numberOfPiecesInactive}> <p>{this.props.challengePieces}</p> </label> :
                    <label title="No. of pieces"> <p>{this.props.numberOfPieces}</p> </label>}
                {(!this.props.inChallenge) ? <button id="plus" title="Increase no. of pieces" onClick={this.onChange}> + </button> : null}
                {(this.props.inChallenge) ?
                    (this.props.challengePowerUps ? <img title="Power Ups Enabled" src={powerupsactive} /> :
                        <img title="Power Ups Disabled" src={powerups} />) :
                    (this.props.enablePowerUps ? <img title="Disable Power Ups" style={{cursor: "pointer"}} src={powerupsactive} onClick={this.props.togglePowerUps} /> :
                        <img title="Enable Power Ups" style={{cursor: "pointer"}} src={powerups} onClick={this.props.togglePowerUps} />)}
            </div>
        );
    }
}