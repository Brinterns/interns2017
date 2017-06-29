import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './app';
import Lobby from './lobby/Lobby';


export default(
  <Route path="/">
    <IndexRoute component={App}/>
    <Route path = "/lobby" component = {Lobby} />
    <Route path="/main" component={App} />
  </Route>
)
