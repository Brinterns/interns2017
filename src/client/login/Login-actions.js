const namespace = "LOGIN/";
export const UPDATE_USERNAME_TEXT = namespace + 'UPDATE_USERNAME_TEXT';

export function updateUsername(username) {
    return {
        type: UPDATE_USERNAME_TEXT,
        payload: username
    }
}
