import {
    UPDATE_USER_ID,
    UPDATE_LIST_OF_PLAYERS,
    UPDATE_CURRENT_PLAYER,
    UPDATE_CURRENT_PLAYER_ONLY,
    GAME_OVER,
    TOGGLE_FORFEIT,
    ROLLED_NUMBER,
    SET_ROOM_NAME,
    UPDATE_GAME_STATE,
    UPDATE_SQUARES,
    UPDATE_MOVEABLE_POSITIONS,
    UPDATE_OPPONENT_SQUARES,
    UPDATE_PIECE_POSITIONS,
    UPDATE_NUM_FINISHED,
    UPDATE_NUM_OPPONENT_FINISHED,
    RESET_ROLL_TEXT,
    OPPONENT_ROLLED_NUMBER,
    RESET_NOTIFICATION_BOOL,
    RESET_STORE
} from './Game-actions';


const numberOfPieces = 7;
const updateState = (currentState, newState) => Object.assign({}, currentState, newState);

const initialState = {
    roomName: '',
    //Identity states
    id: null,
    currentPlayer: null,
    listOfPlayers: [],
    //Game over states
    gameOver : false,
    forfeit: false,
    winnerId: null,
    //Roll states
    rolled: true,
    rollNumber: 'Roll',
    opponentRollNumber: null,
    //Game states
    squares: Array(24).fill(false),
    opponentSquares: Array(24).fill(false),
    piecePositions: Array(numberOfPieces).fill(0),
    moveablePositions: [],
    numPiecesFinished: 0,
    numOppPiecesFinished: 0,
    //Notification states
    notificationBool: false,
    notificationText: null
};

const game = (state = initialState, action) => {
    switch(action.type) {
        case SET_ROOM_NAME: {
            return updateState(state, {
                roomName: action.payload
            });
        }
        case UPDATE_LIST_OF_PLAYERS: {
            return updateState(state, {
                listOfPlayers: action.payload
            });
        }
        case UPDATE_USER_ID: {
            return updateState(state, {
                id: action.payload
            });
        }
        case UPDATE_CURRENT_PLAYER: {
            return updateState(state, {
                currentPlayer: action.payload,
                rolled: false
            });
        }
        case UPDATE_CURRENT_PLAYER_ONLY: {
            return updateState(state, {
                currentPlayer: action.payload
            });
        }
        case GAME_OVER: {
            return updateState(state, {
                forfeit: false,
                winnerId: action.payload,
                gameOver: true
            });
        }
        case TOGGLE_FORFEIT: {
            return updateState(state, {
                forfeit: !state.forfeit
            });
        }
        case ROLLED_NUMBER: {
            return updateState(state, {
                rollNumber: action.payload,
                rolled: true
            });
        }
        case OPPONENT_ROLLED_NUMBER: {
            return updateState(state, {
                opponentRollNumber: action.payload,
                notificationBool: true,
                notificationText: state.listOfPlayers.filter(player => {
                    return player.id === state.currentPlayer;
                })[0].name + " rolled a " + action.payload
            });
        }
        case UPDATE_SQUARES: {
            return updateState(state, {
                squares: action.payload
            });
        }
        case UPDATE_OPPONENT_SQUARES: {
            return updateState(state, {
                opponentSquares: action.payload
            });
        }
        case UPDATE_MOVEABLE_POSITIONS: {
            return updateState(state, {
                moveablePositions: action.payload
            });
        }
        case UPDATE_PIECE_POSITIONS: {
            return updateState(state, {
                piecePositions: action.payload
            });
        }
        case UPDATE_NUM_FINISHED: {
            return updateState(state, {
                numPiecesFinished: action.payload
            });
        }
        case UPDATE_NUM_OPPONENT_FINISHED: {
            return updateState(state, {
                numOppPiecesFinished: action.payload
            });
        }
        case RESET_ROLL_TEXT: {
            if (state.currentPlayer === state.id) {
                if (state.opponentRollNumber === 0) {
                    return updateState(state, {
                        rollNumber: 'Roll'
                    });
                }
                return updateState(state, {
                    rollNumber: 'Roll',
                    notificationText: "It's your turn!"
                });
            }
            return updateState(state, {
                notificationBool: false
            });
        }
        case RESET_NOTIFICATION_BOOL: {
            if (state.currentPlayer === state.id ) {
                return updateState(state, {
                    notificationBool: false
                });
            }
            return state;
        }
        case UPDATE_GAME_STATE: {
            return updateState(state, {
                id: action.payload.id,
                roomName: action.payload.roomName,
                squares: action.payload.squares,
                piecePositions: action.payload.piecePositions,
                opponentSquares: action.payload.opponentSquares,
                numPiecesFinished: action.payload.finishedPieces,
                numOppPiecesFinished: action.payload.finishedOppPieces,
                winnerId: action.payload.winnerId
            });
        }
        case RESET_STORE: {
            return initialState;
        }
        default: {
            return state;
        }
    }
}

export default game;
