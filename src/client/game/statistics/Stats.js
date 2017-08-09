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
        this.toggleStats = this.toggleStats.bind(this);
    }

    toggleStats() {
        this.setState({
            statsDisplay: !this.state.statsDisplay
        });
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
        const id = this.props.id;
        let statsDiv = null;
        if (stats) {
            const userStats = stats.players[stats.playerIds.indexOf(id)];
            const opponentStats = stats.players[(stats.playerIds.indexOf(id) + 1) % 2];
            const userAverages = this.getAverages(userStats);
            const opponentAverages = this.getAverages(opponentStats);
            statsDiv = (
                <div className={statStyling.statsDiv}>
                    <table>
                        <tbody>
                            <tr>
                                <th>Name</th>
                                <td>{emojify(userStats.name)}</td>
                                <td>{emojify(opponentStats.name)}</td>
                            </tr>
                            {this.tableRow("Pieces taken", userStats.piecesTaken, opponentStats.piecesTaken)}
                            {this.tableRow("Pieces lost", userStats.piecesLost, opponentStats.piecesLost)}
                            {this.tableRow("Secs taken per roll (avg)", userAverages[0], opponentAverages[0])}
                            {this.tableRow("Squared moved per turn (avg)", userAverages[1], opponentAverages[1])}
                            {this.tableRow("Turns in end range", userStats.turnsInEndRange, opponentStats.turnsInEndRange)}
                            {this.tableRow("Turns last piece in end range", userStats.turnsLastInEndRange, opponentStats.turnsLastInEndRange)}
                        </tbody>
                    </table>
                </div>
            );
        }

        return (
            <div className={statStyling.mainDiv}>
                <div className={statStyling.toggleDiv}>
                    {this.state.statsDisplay ? <img onClick={this.toggleStats} src={leftarrow} /> : <img onClick={this.toggleStats} src={clipboard} /> }
                </div>
                {this.state.statsDisplay ? statsDiv : null }
            </div>
        );
    }
}
