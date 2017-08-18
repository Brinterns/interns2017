import React, { Component } from 'react';
import {SketchField, Tools} from 'react-sketch';
import ColourPicker from './ColourPicker';
import LinePicker from './LinePicker';
import bin from '../images/icons/bin.png';
import redo from '../images/icons/redo.png';
import undo from '../images/icons/undo.png';
import closeButton from '../images/icons/closebutton.png';
import upload from '../images/icons/upload.png';
import linepicker from '../images/icons/linepicker.png';
import canvasStyles from './Components.css';


export default class DrawCanvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentColour: 'black',
            showColourPicker: false,
            showLinePicker: true,
            currentLineWidth: 2
        }
        this.undoImg = this.undoImg.bind(this);
        this.redoImg = this.redoImg.bind(this);
        this.clearImg = this.clearImg.bind(this);
        this.setLineWidth = this.setLineWidth.bind(this);
        this.toggleColourPicker = this.toggleColourPicker.bind(this);
        this.colourSelected = this.colourSelected.bind(this);
        {this.setBackground()};
    }

    setBackground() {
        setTimeout(() => {
            if (this.refs.drawCanvas) {
                this.refs.drawCanvas.setBackgroundFromDataUrl(this.props.defaultData);
            } else {
                this.setBackground();
            }
        },50);
    }

    clearImg() {
        this.refs.drawCanvas.clear();
    }

    undoImg() {
        this.refs.drawCanvas.undo();
    }

    redoImg() {
        this.refs.drawCanvas.redo();
    }

    toggleColourPicker() {
        this.setState({
            showColourPicker: !this.state.showColourPicker
        });
    }

    colourSelected(colour) {
        this.setState({
            currentColour: colour,
            showColourPicker: false
        });
    }

    setLineWidth(lineWidth) {
        this.setState({
            currentLineWidth: lineWidth,
            showLinePicker: false
        });
        setTimeout(() => {
            this.setState({
                showLinePicker: true
            })
        }, 50);

    }

    render() {
        const updateCanvasButtons = (
            <div className={canvasStyles.drawCanvas}>
                <img onClick={this.props.upload} src={upload}/>
                <img onClick={this.props.close} className={canvasStyles.closeButton} src={closeButton}/>
            </div>
        );
        const buttonColour = {backgroundColor: this.state.currentColour};

        return (
            <div className={this.props.className}>
                <img onClick={this.clearImg} src={bin}/>
                <img onClick={this.undoImg} src={undo}/>
                <img onClick={this.redoImg} src={redo}/>
                <button className={canvasStyles.colourButton} onClick={this.toggleColourPicker} style={buttonColour}/>
                <div className={canvasStyles.lineDropDown}>
                    <img onClick={this.redoImg} src={linepicker}/>
                    {this.state.showLinePicker ? <LinePicker setLineWidth={this.setLineWidth} /> : null}
                </div>
                {this.props.edit ? updateCanvasButtons : null}
                <div className={this.props.canvasClassName}>
                    <SketchField
                    className={""+this.props.sketcherClassName}
                    defaultDataType="url"
                    ref="drawCanvas"
                    tool={Tools.Pencil}
                    lineColor={this.state.currentColour}
                    lineWidth={this.state.currentLineWidth}/>
                </div>
                {this.state.showColourPicker ? <ColourPicker togglePicker={this.toggleColourPicker} colourSelected={this.colourSelected}/> : null}
            </div>
        );
    }
}
