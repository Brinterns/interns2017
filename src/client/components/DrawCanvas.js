import React, { Component } from 'react';
import {SketchField, Tools} from 'react-sketch';
import bin from '../images/icons/bin.png';
import redo from '../images/icons/redo.png';
import undo from '../images/icons/undo.png';

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
        return (
            <div>
                <img onClick={this.clearImg} src={bin}/>
                <img onClick={this.undoImg} src={undo}/>
                <img onClick={this.redoImg} src={redo}/>
                <div className={this.props.canvasClassName}>
                    <SketchField
                    className={this.props.className}
                     ref="drawCanvas"
                     tool={Tools.Pencil}
                     lineColor='black'
                     lineWidth={3}/>
                </div>
            </div>
        );
    }
}
