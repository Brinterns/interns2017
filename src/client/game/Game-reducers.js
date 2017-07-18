import {
    UPDATE_USER_ID,
    UPDATE_LIST_OF_PLAYERS,
    UPDATE_CURRENT_PLAYER,
    GAME_OVER,
    TOGGLE_FORFEIT,
    ROLLED_NUMBER,
    SET_ROOM_NAME,
    UPDATE_GAME_STATE,
    UPDATE_SQUARES
} from './Game-actions';

const updateState = (currentState, newState) => Object.assign({}, currentState, newState);

const initalState = {
    id: null,
    roomName: 'bob',
    listOfPlayers: [],
    currentPlayer: null,
    gameOver : false,
    forfeit: false,
    winnerId: null,
    rolled: true,
    rollNumber: 'Roll',
    squares: Array(24).fill(false)
};

const game = (state = initalState, action) => {
    switch(action.type) {
        case UPDATE_USER_ID: {
            return updateState(state, {
                id: action.payload
            });
        }
        case TOGGLE_FORFEIT: {
            return updateState(state, {
                forfeit: !state.forfeit
            });
        }
        case UPDATE_LIST_OF_PLAYERS: {
            return updateState(state, {
                listOfPlayers: action.payload
            })
        }
        case UPDATE_CURRENT_PLAYER: {
            return updateState(state, {
                currentPlayer: action.payload,
                rolled: false
            })
        }
        case GAME_OVER: {
            return updateState(state, {
                forfeit: false,
                winnerId: action.payload,
                gameOver: true
            })
        }
        case ROLLED_NUMBER: {
            return updateState(state, {
                rollNumber: action.payload,
                rolled: true
            });
        }
        case SET_ROOM_NAME: {
            return updateState(state, {
                roomName: action.payload
            });
        }
        case UPDATE_SQUARES: {
            return updateState(state, {
                squares: action.payload
            });
        }
        case UPDATE_GAME_STATE: {
            return updateState(state, {
                id: action.payload.id,
                roomName: action.payload.roomName,
                squares: action.payload.squares
                // piecePositions: action.payload.piecePositions,
                // opponentSquares: action.payload.opponentSquares,
                // numPiecesFinished: action.payload.finishedPieces,
                // numOppPiecesFinished: action.payload.finishedOppPieces
            });
        }
        default: {
            return state;
        }
    }
}

export default game;
