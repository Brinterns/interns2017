import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import loginStyles from './Users.css';


export default class User extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div>
        <div className={loginStyles.userMain}>
          <h1> Id = {this.props.index} {this.props.name}</h1>
          <button> toready</button>
        </div>
      </div>
    );
  }
}
