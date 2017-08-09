import React, { Component } from 'react';
import statStyling from './Stats.css';
import {emojify} from 'react-emojione';
import clipboard from '../../images/icons/clipboard.png';
import leftarrow from '../../images/icons/leftarrow.png';

export default class Stats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statsDisplay: false
        }
        document.addEventListener('click', this.pageClick.bind(this), true);
        this.toggleStats = this.toggleStats.bind(this);
    }

    toggleStats() {
        this.setState({
            statsDisplay: !this.state.statsDisplay
        });
    }

    pageClick(e) {
        if(e.target.id === "checkboard") {
            return;
        }
        if (this.refs.statistics) {
            this.setState({
                statsDisplay: false
            });
        }
    }

    tableRow(header, entry1, entry2) {
        return (
            <tr>
                <th>{header}</th>
                <td>{entry1}</td>
                <td>{entry2}</td>
            </tr>
        );
    }

    getAverages(playerStats) {
        var timeAvg = 0;
        var squareMoves = 0;
        if (playerStats.numberOfRolls > 0) {
            timeAvg = playerStats.totalTimeTaken / playerStats.numberOfRolls;
        }
        if (playerStats.turnsTaken > 0) {
            squareMoves = playerStats.squaresMoved / playerStats.turnsTaken;
        }
        return [((Math.round(timeAvg * 10) / 10).toFixed(1)), ((Math.round(squareMoves * 10) / 10).toFixed(1))];
    }

    render() {
        const stats = this.props.stats;
        let statsDiv = null;
        if (stats) {
            var playerIndex = stats.playerIds.indexOf(this.props.id);
            //handle spectator case
            if (playerIndex === -1) {
                playerIndex = 0;
            }
            const userStats = stats.players[playerIndex];
            const opponentStats = stats.players[(playerIndex + 1) % 2];
            const userAverages = this.getAverages(userStats);
            const opponentAverages = this.getAverages(opponentStats);
            statsDiv = (
                <div ref="statistics" className={statStyling.statsDiv}>
                    <table>
                        <tbody>
                            <tr>
                                <th></th>
                                <td>{emojify(userStats.name)}</td>
                                <td>{emojify(opponentStats.name)}</td>
                            </tr>
                            {this.tableRow("Average distance per turn", userAverages[1], opponentAverages[1])}
                            {this.tableRow("Pieces taken", userStats.piecesTaken, opponentStats.piecesTaken)}
                            {this.tableRow("Pieces lost", userStats.piecesLost, opponentStats.piecesLost)}
                            {this.tableRow("Pieces per turn in range of end", userStats.turnsInEndRange, opponentStats.turnsInEndRange)}
                            {this.tableRow("Turns in winning range", userStats.turnsLastInEndRange, opponentStats.turnsLastInEndRange)}
                            {this.tableRow("Seconds per roll", userAverages[0], opponentAverages[0])}
                        </tbody>
                    </table>
                </div>
            );
        }

        return (
            <div className={statStyling.mainDiv}>
                <div className={statStyling.toggleDiv}>
                    {this.state.statsDisplay ? <img onClick={this.toggleStats} src={leftarrow} /> : <img id="checkboard" onClick={this.toggleStats} src={clipboard} /> }
                </div>
                {this.state.statsDisplay ? statsDiv : null }
            </div>
        );
    }
}
