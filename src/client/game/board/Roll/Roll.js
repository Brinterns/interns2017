import React, { Component } from 'react';
import rollStyles from './Roll.css';

export default class Roll extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.isPlayerTurn ? rollStyles.clickableDiv : null}>
                <div className={rollStyles.row}>
                    <div className={this.props.isPlayerTurn ? rollStyles.clickableSquare : rollStyles.unClickableSquare} />
                    <div className={this.props.isPlayerTurn ? rollStyles.clickableSquare : rollStyles.unClickableSquare} />
                </div>
                <div className={rollStyles.row}>
                    <div className={this.props.isPlayerTurn ? rollStyles.clickableSquare : rollStyles.unClickableSquare} />
                    <div className={this.props.isPlayerTurn ? rollStyles.clickableSquare : rollStyles.unClickableSquare} />
                </div>
                {(this.props.rollNumber !== 'Roll') ? <h1>{this.props.rollNumber}</h1> : null}
            </div>
        );
    }
}
