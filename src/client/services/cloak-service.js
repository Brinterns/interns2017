import {
    updateMessages,
    updateId,
    updateRoomNames,
    updateUsers
} from '../lobby/Lobby-actions';

import {
    updateUserGameId,
    updateListOfPlayers,
    updateCurrentPlayer,
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
    resetRollText
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
                })[0];
                if (ready) {
                    dispatch(updateUsers(info, ready.ready));
                }
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
                dispatch(resetRollText());
            },
            gameover: (winnerId) => {
                dispatch(gameOver(winnerId));
            },
            gotolobby: () => {
                browserHistory.push('/lobby');
            },
            rolledvalue: (value) => {
                dispatch(rolledValue(value));
            },
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
