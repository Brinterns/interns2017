import {
    updateMessages,
    updateId,
    updateRoomNames,
    updateUsers,
    waitChallenge,
    showChallenge
} from '../lobby/Lobby-actions';

import {
    updateUserGameId,
    updateListOfPlayers,
    updateCurrentPlayer,
    updateCurrentPlayerOnly,
    gameOver,
    rolledValue,
    setRoomName,
    updateGameState,
    updateSquares,
    updateMoveablePositions,
    updateOpponentSquares,
    updatePiecePositions,
    updateFinishedPieces,
    updateOppFinishedPieces,
    resetRollText,
    opponentRolled,
    resetNotificationBool,
    resetStore
} from '../game/Game-actions';

import { dispatch } from '../store';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';


export function RunCloakConfig() {
    cloak.configure({
        messages: {
            /***********************************************************/
            /*                       Login messages                    */
            /***********************************************************/
            gotolobby: () => {
                browserHistory.push("/lobby");
            },
            /***********************************************************/
            /*                       Lobby messages                    */
            /***********************************************************/
            updateusers: (userInfo) => {
                const info = JSON.parse(userInfo);
                const ready = info.filter((user) => {
                    return user.id === localStorage.getItem('userId');
                })[0];
                if (ready) {
                    dispatch(updateUsers(info, ready.ready));
                }
            },
            updaterooms: (roomNames) => {
                dispatch(updateRoomNames(roomNames));
            },
            userid: (id) => {
                localStorage.setItem('userId', id);
                if (!localStorage.getItem('dbId')) {
                    localStorage.setItem('dbId', id);
                }
                dispatch(updateId(id));
                dispatch(updateUserGameId(id));
            },
            waitchallenge: (challenging) => {
                dispatch(waitChallenge(challenging));
            },
            showchallenge: (id) => {
                dispatch(showChallenge(id));
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
            //Identity Messages
            updateplayers: (userinfo) => {
                dispatch(updateListOfPlayers(JSON.parse(userinfo)));
            },
            currentplayer: (current) => {
                dispatch(updateCurrentPlayer(current));
                dispatch(resetRollText());
                setTimeout(() => {
                    dispatch(resetNotificationBool());
                }, 1000);
            },
            currentplayeronly: (current) => {
                dispatch(updateCurrentPlayerOnly(current));
            },
            //Roll messages
            rolledvalue: (value) => {
                dispatch(rolledValue(value));
            },
            opponentroll: (value) => {
                dispatch(opponentRolled(value));
            },
            //End game messages
            gameover: (winnerId) => {
                dispatch(gameOver(winnerId));
            },
            gotolobby: () => {
                dispatch(resetStore());
                browserHistory.push('/lobby');
            },
            //Game state messages
            gamestate: (json) => {
                dispatch(updateGameState(JSON.parse(json)));
            },
            squares: (squares) => {
                dispatch(updateSquares(squares));
            },
            opponentsquares: (squares) => {
                dispatch(updateOpponentSquares(squares));
            },
            moveablepositions: (moveablePositions) => {
                dispatch(updateMoveablePositions(moveablePositions));
            },
            piecepositions: (positions) => {
                dispatch(updatePiecePositions(positions));
            },
            finishedpieces: (numPiecesFinished) => {
                dispatch(updateFinishedPieces(numPiecesFinished));
            },
            finishedopppieces: (numPiecesFinished) => {
                dispatch(updateOppFinishedPieces(numPiecesFinished));
            }
        }
    });
}
