import React, { Component } from 'react';
import optionsStyles from './Components.css';
import options from '../images/icons/options.png';
import optionsactive from '../images/icons/optionsactive.png';
import powerups from '../images/icons/powerups.png';
import powerupsactive from '../images/icons/powerupsactive.png';

export default class ChallengeOptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showOptions: false
        }
        document.addEventListener('click', this.pageClick.bind(this), true);
        this.toggleOptions = this.toggleOptions.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    pageClick(event) {
        if (this.refs.optionsDiv && (event.target.id !== "options") && (event.target.id !== "minus") && (event.target.id !== "plus")) {
            this.setState({
                showOptions: false
            });
        }
    }

    toggleOptions() {
        this.setState({
            showOptions: !this.state.showOptions
        });
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
                transform: 'translate(-50%, 0)',
                margin: '0 0 calc(0.4 * (1vw + 1vh - 1vmin)) 50%'
            }
        }

        return (
            <div ref="optionsDiv" className={optionsStyles.numberOfPiecesToggle} style={parentStyle}>
                <img id="options" className={optionsStyles.optionsImg} src={this.state.showOptions ? optionsactive : options} onClick={this.toggleOptions} />
                {this.state.showOptions ?
                    <div id="options" className={optionsStyles.numberOfPieces}>
                        {(!this.props.inChallenge) ? <button id="minus" title="Decrease no. of pieces" onClick={this.onChange}> - </button> : null}
                        {(this.props.inChallenge) ?
                            <label id="options" title="No. of pieces" className={optionsStyles.numberOfPiecesInactive}> <p id="options">{this.props.challengePieces}</p> </label> :
                            <label id="options" title="No. of pieces"> <p id="options">{this.props.numberOfPieces}</p> </label>
                        }
                        {(!this.props.inChallenge) ? <button id="plus" title="Increase no. of pieces" onClick={this.onChange}> + </button> : null}
                        <br/>
                        {(this.props.inChallenge) ?
                            (this.props.challengePowerUps ? <img id="options" className={optionsStyles.powerUpsImg} title="Power Ups Enabled" src={powerupsactive} /> :
                                <img id="options" className={optionsStyles.powerUpsImg} title="Power Ups Disabled" src={powerups} />) :
                            <span id="options" onClick={this.props.togglePowerUps}>
                                <input id="options" type="checkbox" checked={this.props.enablePowerUps} />
                                {(this.props.enablePowerUps ? <img id="options" className={optionsStyles.powerUpsImg} title="Disable Power Ups" style={{cursor: "pointer"}} src={powerupsactive} /> :
                                    <img id="options" className={optionsStyles.powerUpsImg} title="Enable Power Ups" style={{cursor: "pointer"}} src={powerups} />)}
                            </span>
                        }
                        <br/>
                        <input id="options" type="checkbox" defaultChecked={this.props.alternatePath} onClick={this.props.togglePath} />
                    </div> :
                    null}
            </div>
        );
    }
}