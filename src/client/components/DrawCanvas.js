import React, { Component } from 'react';
import {SketchField, Tools} from 'react-sketch';
import { PhotoshopPicker } from 'react-color';
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
            nextColor: 'black'
        }
        this.undoImg = this.undoImg.bind(this);
        this.redoImg = this.redoImg.bind(this);
        this.clearImg = this.clearImg.bind(this);
        this.handleChangeComplete = this.handleChangeComplete.bind(this);
        this.onAccept = this.onAccept.bind(this);
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

    onAccept() {
        this.setState({
            currentColor: this.state.nextColor
        });
    }

    handleChangeComplete(color, event) {
        this.setState({
            nextColor: color.hex
        });
    }

    render() {
        const updateCanvasButtons = (
            <div className={CanvasStyles.drawCanvas}>
                <img onClick={this.props.upload} src={upload}/>
                <img onClick={this.props.close} className={CanvasStyles.closeButton} src={closeButton}/>
            </div>
        );
        return (
            <div className={this.props.className}>
                <img onClick={this.clearImg} src={bin}/>
                <img onClick={this.undoImg} src={undo}/>
                <img onClick={this.redoImg} src={redo}/>
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
                <div className={CanvasStyles.colorPicker}>
                    <PhotoshopPicker  color={this.state.nextColor} onChangeComplete={ this.handleChangeComplete } onAccept={ this.onAccept }/>
                </div>
            </div>
        );
    }
}
