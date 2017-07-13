import React, { Component } from 'react';
import rulesStyles from './Rules.css';
var pages = require('./Pages.js');

export default class Rules extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1
        };
        this.closeRules = this.closeRules.bind(this);
    }

    closeRules() {
        this.setState({
            page: 0
        });
        this.props.closeRules();
    }
    
    render() {
        return (
            <div>
                {pages.getPage(this.state.page, this.closeRules)}
            </div>
        );
    }
}
