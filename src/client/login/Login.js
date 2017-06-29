import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import styles from './Login.css';

export default class Login extends Component {
  constructor(props){
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onSubmit(e){
    e.preventDefault();
    var username = document.getElementById("inputfield").value;
    cloak.message('setusername', username);
    //Change page to lobby
  }
  render(){
    return (
      <div className={styles.inputbox}>
        <input id="inputfield" type="text"/>
        <button onClick={this.onSubmit}>-></button>
      </div>
    );
  }
}
