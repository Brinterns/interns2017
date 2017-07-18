const namespace = "GAME/";
export const UPDATE_USER_ID = namespace + 'UPDATE_USER_ID';
export const UPDATE_LIST_OF_PLAYERS = namespace + 'UPDATE_LIST_OF_PLAYERS';
export const UPDATE_CURRENT_PLAYER = namespace + 'UPDATE_CURRENT_PLAYER';
export const GAME_OVER = namespace + 'GAME_OVER';
export const TOGGLE_FORFEIT = namespace + 'TOGGLE_FORFEIT';
export const ROLLED_NUMBER = namespace + 'ROLLED_NUMBER';
export const SET_ROOM_NAME = namespace + 'SET_ROOM_NAME';
export const UPDATE_GAME_STATE = namespace + 'UPDATE_GAME_STATE';
export const UPDATE_SQUARES = namespace + 'UPDATE_SQUARES';

export function updateUserGameId(id) {
    localStorage.setItem('userId', id);
    return {
        type: UPDATE_USER_ID,
        payload: id
    }
}

export function toggleForfeit() {
    return {
        type: TOGGLE_FORFEIT
    }
}

export function updateListOfPlayers(listOfPlayers) {
    return {
        type: UPDATE_LIST_OF_PLAYERS,
        payload: listOfPlayers
    }
}

export function rolledValue(value) {
    return {
        type: ROLLED_NUMBER,
        payload: value
    }
}

export function setRoomName(roomName) {
    return {
        type: SET_ROOM_NAME,
        payload: roomName
    }
}

export function updateCurrentPlayer(current) {
    return {
        type: UPDATE_CURRENT_PLAYER,
        payload: current
    }
}

export function gameOver(winnerId) {
    return {
        type: GAME_OVER,
        payload: winnerId
    }
}

export function updateSquares(squares) {
    return {
        type: UPDATE_SQUARES,
        payload: squares
    }
}

export function updateGameState(gameState) {
    return {
        type: UPDATE_GAME_STATE,
        payload: gameState
    }
}
