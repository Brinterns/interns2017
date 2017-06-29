import React, { Component } from 'react';

export default class Login extends Component {
  constructor(props){
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onSubmit(e){
    e.preventDefault();
    var nameInput = document.getElementById("inputfield").value;
  }
  render(){
    return (
      <div>
        <input id="inputfield" type="text"/>
        <button onClick={this.onSubmit}>-></button>
      </div>
    );
  }
}
