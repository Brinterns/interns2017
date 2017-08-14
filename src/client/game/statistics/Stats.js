import React, { Component } from 'react';
import statStyling from './Stats.css';
import {emojify} from 'react-emojione';
import clipboard from '../../images/icons/clipboard.png';
import activeclipboard from '../../images/icons/activeclipboard.png';

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
        if ((e.target.id === "statsButton") || (e.target.id === "statsDiv")) {
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
            <tr id="statsDiv">
                <th id="statsDiv">{header}</th>
                <td id="statsDiv">{entry1}</td>
                <td id="statsDiv">{entry2}</td>
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
        const statsDivClass = this.props.gameOver ? statStyling.statsDivEnd : statStyling.statsDiv;
        const mainDivClass = this.props.gameOver ? statStyling.mainDivEnd : statStyling.mainDiv;

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
                <div id="statsDiv" ref="statistics" className={statsDivClass}>
                    <div className={statStyling.tableDiv}>
                        <table id="statsDiv">
                            <tbody id="statsDiv">
                                <tr id="statsDiv">
                                    <th id="statsDiv"></th>
                                    <td id="statsDiv">{emojify(userStats.name)}</td>
                                    <td id="statsDiv">{emojify(opponentStats.name)}</td>
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
                </div>
            );
        }

        return (
            <div className={mainDivClass}>
                {this.props.gameOver ? null :
                    <div className={statStyling.toggleDiv}>
                        {this.state.statsDisplay ? <img id="statsButton" onClick={this.toggleStats} src={activeclipboard} /> : <img onClick={this.toggleStats} src={clipboard} /> }
                    </div>
                }
                {this.state.statsDisplay || this.props.gameOver ? statsDiv : null }
            </div>
        );
    }
}
