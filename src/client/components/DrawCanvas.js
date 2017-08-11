import React, { Component } from 'react';
import {SketchField, Tools} from 'react-sketch';
import ColourPicker from './ColourPicker';
import bin from '../images/icons/bin.png';
import redo from '../images/icons/redo.png';
import undo from '../images/icons/undo.png';
import closeButton from '../images/icons/closebutton.png';
import upload from '../images/icons/upload.png';
import canvasStyles from './Components.css';

export default class DrawCanvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentColour: 'black',
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

    colourSelected(colour) {
        this.setState({
            currentColour: colour,
            showPicker: false
        });
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
                <button className={canvasStyles.colourButton} onClick={this.togglePicker} style={buttonColour}/>
                {this.props.edit ? updateCanvasButtons : null}
                <div className={this.props.canvasClassName}>
                    <SketchField
                    className={""+this.props.sketcherClassName}
                    defaultDataType="url"
                    ref="drawCanvas"
                    tool={Tools.Pencil}
                    lineColor={this.state.currentColour}
                    lineWidth={3}/>
                </div>
                {this.state.showPicker ? <ColourPicker togglePicker={this.togglePicker} colourSelected={this.colourSelected}/> : null}
            </div>
        );
    }
}
