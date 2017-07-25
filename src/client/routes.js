import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './app';
import Login from './login/Login';
import Lobby from './lobby/Lobby';
import Game from './game/Game';


export default(
    <Route path="/">
        <IndexRoute component={App}/>
        <Route path = "/login" component = {Login} />
        <Route path = "/lobby" component = {Lobby} />
        <Route path="/main" component={App} />
        <Route path="/game/*" component={Game} />
    </Route>
)
