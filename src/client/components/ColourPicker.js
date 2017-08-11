import React, { Component } from 'react';
import pickerStyles from './Components.css';

const colours = [
    "white", "pink", "#cd06d1", "#e81212",
    "orange", "#FAD000", "#03b733", "#028212",
    "#06c6d1", "#0265CB", "#0217db", "#820146",
    "purple", "#230182", "#6b3a06", "black"
];

export default class ColourPicker extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const colourCircles = colours.map((colour, i) => {
            return <div className={pickerStyles.colourDiv} style={{backgroundColor: colour}} onClick={() => {this.props.colourSelected(colour)}} key={i}/>
        });

        return (
            <div className={pickerStyles.colourPicker}>
                {colourCircles}
            </div>
        );
    }
}
