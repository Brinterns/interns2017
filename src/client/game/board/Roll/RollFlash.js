import React, { Component } from 'react';
import rollStyles from './Roll.css';

export default class RollFlash extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let rollArray = this.props.sequence;
        let blinkBool = true;
        //if the roll sequence is not defined but a roll number is
        //display a standard sequence
        if (!rollArray) {
            blinkBool = false;
            rollArray = ("1".repeat(this.props.rollNumber) + "0".repeat(4-this.props.rollNumber));
        }
        const background0 = {backgroundColor: '#e81212'};
        const background1 = {backgroundColor: '#03b733'};
        return (
            <div>
                <div className={rollStyles.row}>
                    <div style={(rollArray[0] === "1" ) ? background1 : background0} className={blinkBool ? rollStyles.squareBlink0 : rollStyles.squareNoBlink} />
                    <div style={(rollArray[1] === "1" ) ? background1 : background0} className={blinkBool ? rollStyles.squareBlink1 : rollStyles.squareNoBlink} />
                </div>
                <div className={rollStyles.row}>
                    <div style={(rollArray[2] === "1" ) ? background1 : background0} className={blinkBool ? rollStyles.squareBlink2 : rollStyles.squareNoBlink} />
                    <div style={(rollArray[3] === "1" ) ? background1 : background0} className={blinkBool ? rollStyles.squareBlink3 : rollStyles.squareNoBlink} />
                </div>
                {(this.props.rollNumber !== 'Roll') ? <h1>{this.props.rollNumber}</h1> : null}
            </div>
        );
    }
}
