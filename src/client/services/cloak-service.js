import {
    updateLobbyMessages,
    updateId,
    updateRoomNames,
    updateUsers,
    updateChallenging,
    updateChallengers,
    updateMiniMap
} from '../lobby/Lobby-actions';

import {
    updateUserGameId,
    updateMoveId,
    spectatingId,
    updateGameMessages,
    updateListOfPlayers,
    updateCurrentPlayer,
    updateCurrentPlayerOnly,
    opponentDisconnect,
    gameOver,
    challengerDetails,
    rolledValue,
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
    resetStore,
    rollSequence,
    oppRollSequence,
    updateGameStats,
    updateSpectators,
    updatePowerUps,
    newPowerUp,
    enablePowerUps,
    updatePowerablePieces,
    updateActivePowerUps,
    updatePowerUpNotif,
    autoReRoll,
    updatePathData,
    opponentGhost,
    ghost
} from '../game/Game-actions';

import { dispatch } from '../store';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';



export function RunCloakConfig() {
    cloak.configure({
        messages: {
            gotologin: () => {
                browserHistory.push("/login");
            },
            /***********************************************************/
            /*                       Lobby messages                    */
            /***********************************************************/
            updateusers: (userInfo) => {
                const info = JSON.parse(userInfo);
                const user = info.filter((user) => {
                    return user.id === localStorage.getItem('userId');
                })[0];
                if (user) {
                    dispatch(updateUsers(info));
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
            updatechallenging: (challenging) => {
                dispatch(updateChallenging(challenging));
            },
            updatechallengers: (challengers) => {
                dispatch(updateChallengers(challengers));
            },
            joingame: (roomId) => {
                dispatch(resetStore());
                browserHistory.push('/game/' + roomId);
            },
            spectategame: (roomId) => {
                dispatch(resetStore());
                browserHistory.push('/spectate/' + roomId);
            },
            updatelobbymessages: (messages) => {
                dispatch(updateLobbyMessages(JSON.parse(messages)));
            },
            minimapstate: (gameState) => {
                dispatch(updateMiniMap(JSON.parse(gameState)));
            },
            redirect: (url) => {
                window.location = (url);
            },
            /***********************************************************/
            /*                       Stats messages                     */
            /***********************************************************/
            updatestats: (stats) => {
                dispatch(updateGameStats(JSON.parse(stats)));
            },
            /***********************************************************/
            /*                       Game messages                     */
            /***********************************************************/
            //Identity Messages
            updatemoveid: (id) => {
                dispatch(updateMoveId(id));
            },
            updateplayers: (userinfo) => {
                dispatch(updateListOfPlayers(JSON.parse(userinfo)));
            },
            spectatingid: (id) => {
                dispatch(spectatingId(id));
            },
            updategamemessages: (messages) => {
                dispatch(updateGameMessages(JSON.parse(messages)));
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
            updatespectators: (spectators) => {
                dispatch(updateSpectators(spectators));
            },
            rolledvalue: (value) => {
                dispatch(rolledValue(value));
            },
            opponentroll: (value) => {
                dispatch(opponentRolled(value));
            },
            rollsequence: (sequence) => {
                dispatch(rollSequence(sequence));
            },
            opponentsequence: (sequence) => {
                dispatch(oppRollSequence(sequence));
            },
            //End game messages
            opponentdisconnect: () => {
                dispatch(opponentDisconnect());
            },
            gameover: (winnerId) => {
                dispatch(gameOver(winnerId));
            },
            gotolobby: () => {
                dispatch(resetStore());
                browserHistory.push('/lobby');
            },
            challengerdetails: (id) => {
                dispatch(challengerDetails(id));
            },
            //Game state messages
            gamestate: (json) => {
                dispatch(updateGameState(JSON.parse(json)));
            },
            pathdata: (pathData) => {
                dispatch(updatePathData(JSON.parse(pathData)));
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
            },
            updatepowerups: (powerups) => {
                dispatch(updatePowerUps(JSON.parse(powerups)));
            },
            newpowerup: (powerUp) => {
                dispatch(newPowerUp(powerUp));
            },
            enablepowerups: (enabled) => {
                dispatch(enablePowerUps(enabled));
            },
            powerpieces: (powerUpPieces) => {
                dispatch(updatePowerablePieces(powerUpPieces));
            },
            activepowerups: (activePowerUps) => {
                dispatch(updateActivePowerUps(activePowerUps));
            },
            powernotify: (powerUpUsed) => {
                dispatch(updatePowerUpNotif([powerUpUsed, true]));
                setTimeout(() => {
                    dispatch(updatePowerUpNotif([null, false]));
                }, 1500);
            },
            opponentghost: (opponentGhostTurns) => {
                dispatch(opponentGhost(opponentGhostTurns));
            },
            ghost: (ghostTurns) => {
                dispatch(ghost(ghostTurns));
            },
            autoreroll: () => {
                dispatch(autoReRoll());
            }
        }
    });
}
