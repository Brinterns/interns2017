import React, { Component } from 'react';
import {SketchField, Tools} from 'react-sketch';
import bin from '../images/icons/bin.png';
import redo from '../images/icons/redo.png';
import undo from '../images/icons/undo.png';
import closeButton from '../images/icons/closeButton.png';
import upload from '../images/icons/upload.png';

import CanvasStyles from './Components.css';

export default class DrawCanvas extends Component {
    constructor(props) {
        super(props);
        this.undoImg = this.undoImg.bind(this);
        this.redoImg = this.redoImg.bind(this);
        this.clearImg = this.clearImg.bind(this);
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
                    className={this.props.sketcherClassName}
                     ref="drawCanvas"
                     tool={Tools.Pencil}
                     lineColor='black'
                     lineWidth={3}/>
                </div>
            </div>
        );
    }
}
