import {
    updateMessages,
    updateId,
    updateRoomNames,
    updateUsers
} from '../lobby/Lobby-actions';

import {
    updateUserGameId,
    updateListOfPlayers,
    updateCurrentPlayer
} from '../game/Game-actions';

import { dispatch } from '../store';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';


export function RunCloakConfig() {
    cloak.configure({
        messages: {
            /***********************************************************/
            /*                       Lobby messages                    */
            /***********************************************************/
            updateusers: (userInfo) => {
                const info = JSON.parse(userInfo);
                const ready = info.filter((user) => {
                    return user.id === localStorage.getItem('userId');
                })[0].ready;
                dispatch(updateUsers(info, ready));
            },
            updaterooms: (roomNames) => {
                dispatch(updateRoomNames(roomNames));
            },
            userid: (id) => {
                dispatch(updateId(id));
                dispatch(updateUserGameId(id));
            },
            joingame: (roomId) => {
                browserHistory.push('/game/' + roomId);
            },
            updatemessages: (messages) => {
                dispatch(updateMessages(JSON.parse(messages)));
            },
            /***********************************************************/
            /*                       Game messages                     */
            /***********************************************************/
            updateplayers: (userinfo) => {
                dispatch(updateListOfPlayers(JSON.parse(userinfo)));
            },

            currentplayer: (current) => {
                dispatch(updateCurrentPlayer(current));
            }
        }
    });
}
