import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import styles from './Login.css';

export default class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: ''
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(event){
    this.setState ({
      username: event.target.value
    });
  }

  onSubmit(e){
    const { username } = this.state;
    cloak.message('setusername', username);
    browserHistory.push("/lobby");
  }

  render(){
    return (
      <div className={styles.pageBackground}>
        <div className={styles.backgroundBlock}>
          <div className={styles.inputbox}>
            <form onSubmit={this.onSubmit}>
              <input className={styles.nameField}  type="text" placeholder="Username" value={this.state.username} onChange={this.handleChange}/>
              <input className={styles.submitButton} type="submit" value="Submit"/>
            </form>
          </div>
        </div>
      </div>
    );
  }
}