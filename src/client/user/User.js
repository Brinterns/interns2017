import React, { Component } from 'react';
import { browserHistory } from 'react-router';

export default class User extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div>
        <h1>Id= {this.props.index} {this.props.name}</h1>
        <button> toready</button>
      </div>
    );
  }
}
