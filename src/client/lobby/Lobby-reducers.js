import {
    UPDATE_MESSAGES,
    UPDATE_USER_ID,
    UPDATE_ROOM_NAMES,
    UPDATE_USERS,
    UPDATE_CHALLENGING,
    UPDATE_CHALLENGERS
} from './Lobby-actions';

const updateState = (currentState, newState) => Object.assign({}, currentState, newState);

const initialState = {
    id: null,
    listOfUsers: [],
    listOfActiveGames: [],
    messages: [],
    challengers: [],
    challenging: [],
    winLossRecord: null,
    elorank: null
};

const lobby = (state = initialState, action) => {
    switch(action.type) {
        case UPDATE_MESSAGES: {
            return updateState(state, {
                messages: action.payload
            });
        }
        case UPDATE_USERS: {
            return updateState(state, {
                listOfUsers: action.payload,
                winLossRecord: state.id ? action.payload.filter(user => {
                    return state.id === user.id;
                })[0].winLossRecord : null,
                elorank: state.id ? action.payload.filter(user => {
                    return state.id === user.id;
                })[0].elorank : null
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
        case UPDATE_CHALLENGING: {
            return updateState(state, {
                challenging: action.payload ? action.payload : []
            });
        }
        case UPDATE_CHALLENGERS: {
            return updateState(state, {
                challengers: action.payload ? action.payload : []
            });
        }
        default: {
            return state;
        }
    }
}

export default lobby;
