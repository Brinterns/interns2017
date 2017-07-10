import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import boardStyles from './Board.css';

export default class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        return (
            <div className={boardStyles.boardMainDiv}>
                <div className={boardStyles.squaresColumn}>
                    <div className={boardStyles.squareNormal} />
                    <div className={boardStyles.squareNormal} />
                    <div className={boardStyles.squareNormal} />
                </div>
                <div className={boardStyles.squaresColumn}>
                    <div className={boardStyles.squareRosetta} />
                    <div className={boardStyles.squareNormal} />
                    <div className={boardStyles.squareRosetta} />
                </div>
                <div className={boardStyles.squaresColumn}>
                    <div className={boardStyles.squareBlank} />
                    <div className={boardStyles.squareNormal} />
                    <div className={boardStyles.squareBlank} />
                </div>
                <div className={boardStyles.squaresColumn}>
                    <div className={boardStyles.squareBlank} />
                    <div className={boardStyles.squareNormal} />
                    <div className={boardStyles.squareBlank} />
                </div>
                <div className={boardStyles.squaresColumn}>
                    <div className={boardStyles.squareNormal} />
                    <div className={boardStyles.squareRosetta} />
                    <div className={boardStyles.squareNormal} />
                </div>
                <div className={boardStyles.squaresColumn}>
                    <div className={boardStyles.squareNormal} />
                    <div className={boardStyles.squareNormal} />
                    <div className={boardStyles.squareNormal} />
                </div>
                <div className={boardStyles.squaresColumn}>
                    <div className={boardStyles.squareNormal} />
                    <div className={boardStyles.squareNormal} />
                    <div className={boardStyles.squareNormal} />
                </div>
                <div className={boardStyles.squaresColumn}>
                    <div className={boardStyles.squareRosetta} />
                    <div className={boardStyles.squareNormal} />
                    <div className={boardStyles.squareRosetta} />
                </div>
            </div>
        );
    }
}
