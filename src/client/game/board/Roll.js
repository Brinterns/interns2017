import React, { Component } from 'react';
import rollStyles from './Roll.css';

export default class Roll extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const rollArray = ("1".repeat(this.props.rollNumber) + "0".repeat(4-this.props.rollNumber)).split('').sort(function(){return 0.5-Math.random()});
        const background0 = {backgroundColor: 'red'};
        const background1 = {backgroundColor: 'green'};
        return (
            <div>
                <div className={rollStyles.row}>
                    <div style={(rollArray[0] === "1" ) ? background1 : background0} className={rollStyles.squareBlink0} />
                    <div style={(rollArray[1] === "1" ) ? background1 : background0} className={rollStyles.squareBlink1} />
                </div>
                <div className={rollStyles.row}>
                    <div style={(rollArray[2] === "1" ) ? background1 : background0} className={rollStyles.squareBlink2} />
                    <div style={(rollArray[3] === "1" ) ? background1 : background0} className={rollStyles.squareBlink3} />
                </div>
            </div>
        );
    }
}
