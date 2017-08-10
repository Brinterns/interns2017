import React, { Component } from 'react';
import {SketchField, Tools} from 'react-sketch';
import bin from '../images/icons/bin.png';
import redo from '../images/icons/redo.png';
import undo from '../images/icons/undo.png';
import closeButton from '../images/icons/closebutton.png';
import upload from '../images/icons/upload.png';

import CanvasStyles from './Components.css';

export default class DrawCanvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentColor: 'black',
            showPicker: false
        }
        this.undoImg = this.undoImg.bind(this);
        this.redoImg = this.redoImg.bind(this);
        this.clearImg = this.clearImg.bind(this);
        this.togglePicker = this.togglePicker.bind(this);
        this.colourSelected = this.colourSelected.bind(this);
        {this.setBackground()}
    }

    setBackground() {
        setTimeout(() => {
            if (this.refs.drawCanvas) {
                this.refs.drawCanvas.setBackgroundFromDataUrl(this.props.defaultData);
            } else {
                setBackground();
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

    togglePicker() {
        this.setState({
            showPicker: !this.state.showPicker
        });
    }

    colourSelected(color) {
        this.setState({
            nextColor: color
        });
    }

    render() {
        const updateCanvasButtons = (
            <div className={CanvasStyles.drawCanvas}>
                <img onClick={this.props.upload} src={upload}/>
                <img onClick={this.props.close} className={CanvasStyles.closeButton} src={closeButton}/>
            </div>
        );
        const buttonColor = {backgroundColor: this.state.currentColor};
        const pickerDiv = (
            <div className={CanvasStyles.colorPicker}>
                <div>
                    
                </div>
            </div>
        );
        return (
            <div className={this.props.className}>
                <img onClick={this.clearImg} src={bin}/>
                <img onClick={this.undoImg} src={undo}/>
                <img onClick={this.redoImg} src={redo}/>
                <button onClick={this.togglePicker} style={buttonColor}> &nbsp;&nbsp; </button>
                {this.props.edit ? updateCanvasButtons : null}
                <div className={this.props.canvasClassName}>
                    <SketchField
                    className={""+this.props.sketcherClassName}
                    defaultDataType="url"
                    ref="drawCanvas"
                    tool={Tools.Pencil}
                    lineColor={this.state.currentColor}
                    lineWidth={3}/>
                </div>
                {this.state.showPicker ? pickerDiv : null}
            </div>
        );
    }
}
