import React, { Component } from 'react';
import pickerStyles from './Components.css';

const colours = ['black', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink']

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
