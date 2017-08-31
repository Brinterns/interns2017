import React, { Component } from 'react';
import optionsStyles from './Components.css';
import options from '../images/challengeoptions/options.png';
import optionschanged from '../images/challengeoptions/optionschanged.png';
import optionsactive from '../images/challengeoptions/optionsactive.png';
import powerups from '../images/challengeoptions/powerups.png';
import powerupsactive from '../images/challengeoptions/powerupsactive.png';
import originalpath from '../images/challengeoptions/originalpath.png';
import alternatepath from '../images/challengeoptions/alternatepath.png';

export default class ChallengeOptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showOptions: false,
            id: "options" + this.props.index
        }
        document.addEventListener('click', this.pageClick.bind(this), true);
        this.toggleOptions = this.toggleOptions.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    pageClick(event) {
        if (this.refs.optionsDiv && (event.target.id !== this.state.id) && (event.target.id !== "minus") && (event.target.id !== "plus")) {
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
        var highlightOptions = this.props.inChallenge && ((this.props.challengePieces !== 7) || this.props.challengePowerUps || this.props.challengeAlternatePath);
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
                <img id={this.state.id} className={optionsStyles.optionsImg} src={this.state.showOptions ? optionsactive : (highlightOptions ? optionschanged : options)} onClick={this.toggleOptions} />
                {this.state.showOptions ?
                    <div id={this.state.id} className={optionsStyles.numberOfPieces}>
                        {!this.props.inChallenge ? <button id="minus" title="Decrease no. of pieces" onClick={this.onChange}> - </button> : null}
                        {this.props.inChallenge ?
                            <label id={this.state.id} title="No. of pieces" className={optionsStyles.numberOfPiecesInactive}> <p id={this.state.id}>{this.props.challengePieces}</p> </label> :
                            <label id={this.state.id} title="No. of pieces"> <p id={this.state.id}>{this.props.numberOfPieces}</p> </label>
                        }
                        {!this.props.inChallenge ? <button id="plus" title="Increase no. of pieces" onClick={this.onChange}> + </button> : null}
                        <br/>
                        {this.props.inChallenge ?
                            (this.props.challengePowerUps ?
                                <img id={this.state.id} className={optionsStyles.powerUpsImg} title="Power Ups Enabled" src={powerupsactive} /> :
                                <img id={this.state.id} className={optionsStyles.powerUpsImg} title="Power Ups Disabled" src={powerups} />
                            ) :
                            <span id={this.state.id} onClick={this.props.togglePowerUps}>
                                <input id={this.state.id} type="checkbox" checked={this.props.enablePowerUps} onChange={() => {}} />
                                {(this.props.enablePowerUps ?
                                    <img id={this.state.id} className={optionsStyles.powerUpsImg} title="Disable Power Ups" style={{cursor: "pointer"}} src={powerupsactive} /> :
                                    <img id={this.state.id} className={optionsStyles.powerUpsImg} title="Enable Power Ups" style={{cursor: "pointer"}} src={powerups} />
                                )}
                            </span>
                        }
                        <br/>

                        {this.props.inChallenge ?
                            (this.props.challengeAlternatePath ?
                                <img id={this.state.id} className={optionsStyles.pathImg} src={alternatepath} /> :
                                <img id={this.state.id} className={optionsStyles.pathImg} src={originalpath} />
                            ) :
                            <span id={this.state.id} onClick={this.props.togglePath}>
                                <input id={this.state.id} type="checkbox" checked={this.props.alternatePath} onChange={() => {}} />
                                {this.props.alternatePath ?
                                    <img id={this.state.id} className={optionsStyles.pathImg} style={{cursor: "pointer"}} src={alternatepath} /> :
                                    <img id={this.state.id} className={optionsStyles.pathImg} style={{cursor: "pointer"}} src={originalpath} />
                                }
                            </span>
                        }


                    </div> :
                    null}
            </div>
        );
    }
}