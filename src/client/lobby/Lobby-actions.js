const namespace = "LOBBY/";
export const UPDATE_MESSAGES = namespace + 'UPDATE_MESSAGES';
export const UPDATE_USER_ID = namespace + 'UPDATE_USER_ID';
export const UPDATE_ROOM_NAMES = namespace + 'UPDATE_ROOM_NAMES';
export const UPDATE_USERS = namespace + 'UPDATE_USERS';

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

export function updateMessages(messages) {
    return {
        type: UPDATE_MESSAGES,
        payload: messages
    }
}
