import React, { Component } from 'react';
import pickerStyles from './Components.css';
import line5 from '../images/linewidth/line5.png';
import line10 from '../images/linewidth/line10.png';
import line15 from '../images/linewidth/line15.png';
import line20 from '../images/linewidth/line20.png';
import line30 from '../images/linewidth/line30.png';


export default class LinePicker extends Component {
    constructor(props) {
        super(props);
        this.setLineWidth = this.setLineWidth.bind(this);
    }

    setLineWidth(lineWidth) {
        this.props.setLineWidth(lineWidth);
    }

    render() {
        return (
            <div className={pickerStyles.lineDropDownContent}>
                <img src={line5} onClick={() => {this.setLineWidth(1)}} />
                <img src={line10} onClick={() => {this.setLineWidth(5)}} />
                <img src={line15} onClick={() => {this.setLineWidth(15)}} />
                <img src={line20} onClick={() => {this.setLineWidth(20)}} />
                <img src={line30} onClick={() => {this.setLineWidth(30)}} />
            </div>
        );
    }
}
