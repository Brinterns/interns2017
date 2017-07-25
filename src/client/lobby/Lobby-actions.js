const namespace = "LOBBY/";
export const UPDATE_MESSAGES = namespace + 'UPDATE_MESSAGES';
export const UPDATE_USER_ID = namespace + 'UPDATE_USER_ID';
export const UPDATE_ROOM_NAMES = namespace + 'UPDATE_ROOM_NAMES';
export const UPDATE_USERS = namespace + 'UPDATE_USERS';
export const WAIT_CHALLENGE = namespace + 'WAIT_CHALLENGE';
export const SHOW_CHALLENGE = namespace + 'SHOW_CHALLENGE';

export function updateId(id) {
    localStorage.setItem('userId', id);
    return {
        type: UPDATE_USER_ID,
        payload: id
    }
}

export function updateUsers(listOfUsers, ready) {
    return {
        type: UPDATE_USERS,
        payload: {
            listOfUsers: listOfUsers,
            ready: ready
        }
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

export function showChallenge(id) {
    return {
        type: SHOW_CHALLENGE,
        payload: id
    }
}

export function waitChallenge(challenging) {
    return {
        type: WAIT_CHALLENGE,
        payload: challenging
    }
}
