import React, { Component } from 'react';
import rollStyles from './Roll.css';

export default class Roll extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className={rollStyles.row}>
                    <div className={rollStyles.clickableSquare} />
                    <div className={rollStyles.clickableSquare} />
                </div>
                <div className={rollStyles.row}>
                    <div className={rollStyles.clickableSquare} />
                    <div className={rollStyles.clickableSquare} />
                </div>
                <h1>Roll</h1>
            </div>
        );
    }
}
