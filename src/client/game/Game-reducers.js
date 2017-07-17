import {
    UPDATE_USER_ID,
    UPDATE_LIST_OF_PLAYERS
} from './Game-actions';

const updateState = (currentState, newState) => Object.assign({}, currentState, newState);

const initalState = {
    id: null,
    listOfPlayers: [],
    currentPlayer: null
};

const game = (state = initalState, action) => {
    switch(action.type) {
        case UPDATE_USER_ID: {
            return updateState(state, {
                id: action.payload
            });
        }
        case UPDATE_LIST_OF_PLAYERS: {
            return updateState(state, {
                listOfPlayers: action.payload
            })
        }
        case UPDATE_CURRENT_PLAYER: {
            return updateState(state, {
                currentPlayer: action.payload
            })
        }
        default: {
            return state;
        }
    }
}

export default game;
