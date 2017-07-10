import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import boardStyles from './Board.css';



const squareN = boardStyles.squareNormal;
const squareR = boardStyles.squareRosetta;
const squareB = boardStyles.squareBlank;

export default class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.squareColumn = this.squareColumn.bind(this);
    }

    squareColumn(class1, class2, class3) {
        return (
            <div className={boardStyles.squaresColumn}>
                <div className={class1} />
                <div className={class2} />
                <div className={class3} />
            </div>
        );
    }

    render() {
        return (
                <div className={boardStyles.boardMainDiv}>
                    {this.squareColumn(squareN,squareN,squareN)}
                    {this.squareColumn(squareR,squareN,squareR)}
                    {this.squareColumn(squareB,squareN,squareB)}
                    {this.squareColumn(squareB,squareN,squareB)}
                    {this.squareColumn(squareN,squareR,squareN)}
                    {this.squareColumn(squareN,squareN,squareN)}
                    {this.squareColumn(squareN,squareN,squareN)}
                    {this.squareColumn(squareR,squareN,squareR)}
                </div>
        );
    }
}
