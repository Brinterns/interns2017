import React, { Component } from 'react';
import rulesStyles from './Rules.css';
var pages = require('./Pages.js');

export default class Rules extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1
        };
        this.toggleRules = this.toggleRules.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
    }

    toggleRules() {
        this.setState({
            page: 0
        });
        this.props.toggleRules();
    }

    prevPage() {
        this.setState({
            page: this.state.page - 1
        });
    }

    nextPage() {
        this.setState({
            page: this.state.page + 1
        });
    }
    
    render() {
        return (
            <div>
                {pages.getPage(this.state.page, this.toggleRules, this.prevPage, this.nextPage)}
            </div>
        );
    }
}
