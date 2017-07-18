import {
    UPDATE_USER_ID,
    UPDATE_LIST_OF_PLAYERS,
    UPDATE_CURRENT_PLAYER,
    GAME_OVER
} from './Game-actions';

const updateState = (currentState, newState) => Object.assign({}, currentState, newState);

const initalState = {
    id: null,
    listOfPlayers: [],
    currentPlayer: null,
    gameOver : false,
    forfeit: false,
    winnerId: null
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
        case GAME_OVER: {
            return updateState(state, {
                forfeit: false,
                winnerId: action.payload,
                gameOver: true
            })
        }
        default: {
            return state;
        }
    }
}

export default game;
