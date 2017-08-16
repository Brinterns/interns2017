const namespace = "LOBBY/";
export const UPDATE_MESSAGES = namespace + 'UPDATE_MESSAGES';
export const UPDATE_USER_ID = namespace + 'UPDATE_USER_ID';
export const UPDATE_ROOM_NAMES = namespace + 'UPDATE_ROOM_NAMES';
export const UPDATE_USERS = namespace + 'UPDATE_USERS';
export const UPDATE_CHALLENGING = namespace + 'UPDATE_CHALLENGING';
export const UPDATE_CHALLENGERS = namespace + 'UPDATE_CHALLENGERS';
export const UPDATE_MINI_MAP = namespace + 'UPDATE_MINI_MAP';

export function updateId(id) {
    localStorage.setItem('userId', id);
    return {
        type: UPDATE_USER_ID,
        payload: id
    }
}

export function updateMiniMap(gameStats) {
    return {
        type: UPDATE_MINI_MAP,
        payload: gameStats
    }
}

export function updateUsers(listOfUsers) {
    return {
        type: UPDATE_USERS,
        payload: listOfUsers
    }
}

export function updateRoomNames(roomNames) {
    return {
        type: UPDATE_ROOM_NAMES,
        payload: roomNames
    }
}

export function updateLobbyMessages(messages) {
    return {
        type: UPDATE_MESSAGES,
        payload: messages
    }
}

export function updateChallenging(challenging) {
    return {
        type: UPDATE_CHALLENGING,
        payload: challenging
    }
}

export function updateChallengers(challengers) {
    return {
        type: UPDATE_CHALLENGERS,
        payload: challengers
    }
}
