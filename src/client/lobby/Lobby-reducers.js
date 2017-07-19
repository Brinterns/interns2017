import {
    UPDATE_MESSAGES,
    UPDATE_USER_ID,
    UPDATE_ROOM_NAMES,
    UPDATE_USERS
} from './Lobby-actions';

const updateState = (currentState, newState) => Object.assign({}, currentState, newState);

const initalState = {
    id: null,
    listOfUsers: [],
    listOfActiveGames: [],
    messages: [],
    ready: false,
    winLossRecord: null
};

const lobby = (state = initalState, action) => {
    switch(action.type) {
        case UPDATE_MESSAGES: {
            return updateState(state, {
                messages: action.payload
            });
        }
        case UPDATE_USERS: {
            return updateState(state, {
                listOfUsers: action.payload.listOfUsers,
                ready: action.payload.ready,
                winLossRecord: state.id ? action.payload.listOfUsers.filter(user => {
                    return state.id === user.id;
                })[0].winLossRecord : null
            });
        }
        case UPDATE_USER_ID: {
            return updateState(state, {
                id: action.payload
            });
        }
        case UPDATE_ROOM_NAMES: {
            return updateState(state, {
                listOfActiveGames: action.payload
            });
        }
        default: {
            return state;
        }
    }
}

export default lobby;
