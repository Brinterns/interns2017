import { combineReducers } from 'redux';
import login from '../login/Login-reducers';
import lobby from '../lobby/Lobby-reducers';


export default combineReducers({
    login,
    lobby
});
