import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import loginStyles from './Users.css';


export default class User extends Component {
  constructor(props){
    super(props);
    this.state = {
        ready: false
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    const ready = !this.state.ready;
    cloak.message('userready', ready);
    this.setState({
      ready: ready
    });
  }

  render(){
    return (
      <div>
        <div className={loginStyles.userMain}>
          <h1> Id = {this.props.index} {this.props.name}</h1>
          <button onClick={this.onClick}>{this.state.ready ? "Unready" : "Ready"}</button>
        </div>
      </div>
    );
  }
}
