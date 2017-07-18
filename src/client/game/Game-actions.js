const namespace = "GAME/";
export const UPDATE_USER_ID = namespace + 'UPDATE_USER_ID';
export const UPDATE_LIST_OF_PLAYERS = namespace + 'UPDATE_LIST_OF_PLAYERS';
export const UPDATE_CURRENT_PLAYER = namespace + 'UPDATE_CURRENT_PLAYER';
export const GAME_OVER = namespace + 'GAME_OVER';

export function updateUserGameId(id) {
    localStorage.setItem('userId', id);
    return {
        type: UPDATE_USER_ID,
        payload: id
    }
}

export function updateListOfPlayers(listOfPlayers) {
    return {
        type: UPDATE_LIST_OF_PLAYERS,
        payload: listOfPlayers
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
