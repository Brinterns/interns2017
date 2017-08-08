import React, { Component } from 'react';
import statStyling from './Stats.css';
import clipboard from '../../images/icons/clipboard.png';
import leftarrow from '../../images/icons/leftarrow.png';

export default class Stats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statsDisplay: false
        }
        this.toggleStats = this.toggleStats.bind(this);
    }

    toggleStats() {
        this.setState({
            statsDisplay: !this.state.statsDisplay
        });
    }

    render() {
        const statsDiv = (
            <img onClick={this.toggleStats} src={leftarrow} />
        );

        return (
            <div className={statStyling.mainDiv}>
                {this.state.statsDisplay ? statsDiv : <img onClick={this.toggleStats} src={clipboard} /> }
            </div>
        );
    }
}
