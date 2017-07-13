import React, { Component } from 'react';
import rulesStyles from './Rules.css';
var pages = require('./Pages.js');

export default class Rules extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0
        };
    }
    
    render() {
        return (
            <div className={rulesStyles.rulesWindow}>
                {pages.getPage(0)}
            </div>
        );
    }
}
