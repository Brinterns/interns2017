import {
    UPDATE_USER_ID,
    UPDATE_SPECTATING_ID,
    UPDATE_MESSAGES,
    UPDATE_LIST_OF_PLAYERS,
    UPDATE_CURRENT_PLAYER,
    UPDATE_CURRENT_PLAYER_ONLY,
    OPPONENT_DISCONNECT,
    GAME_OVER,
    CHALLENGER_ID,
    TOGGLE_FORFEIT,
    ROLLED_NUMBER,
    ROLLED_SEQUENCE,
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
    RESET_STORE,
    UPDATE_GAME_STATS,
    UPDATE_NUMBER_OF_SPECTATORS
} from './Game-actions';


const numberOfPieces = 7;
const updateState = (currentState, newState) => Object.assign({}, currentState, newState);

const initialState = {
    messages: [],
    //Identity states
    id: null,
    spectatingId: null,
    currentPlayer: null,
    listOfPlayers: [],
    //Game over states
    gameOver : false,
    forfeit: false,
    winnerId: null,
    numSpectators: 0,
    //Roll states
    rolled: true,
    rollNumber: 'Roll',
    opponentRollNumber: null,
    rollSequence: null,
    //Game states
    numberOfPieces: 7,
    squares: Array(24).fill(false),
    opponentSquares: Array(24).fill(false),
    piecePositions: Array(numberOfPieces).fill(0),
    moveablePositions: [],
    numPiecesFinished: 0,
    numOppPiecesFinished: 0,
    //Notification states
    notificationBool: false,
    notificationText: null,
    opponentDisconnect: false,
    challengerId: null,
    //Game statistics
    gameStats: null
};

const game = (state = initialState, action) => {
    switch(action.type) {
        case UPDATE_SPECTATING_ID: {
            return updateState(state, {
                spectatingId: action.payload
            });
        }
        case UPDATE_MESSAGES: {
            return updateState(state, {
                messages: action.payload
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
        case OPPONENT_DISCONNECT: {
            return updateState(state, {
                opponentDisconnect: true
            });
        }
        case GAME_OVER: {
            return updateState(state, {
                forfeit: false,
                winnerId: action.payload,
                gameOver: true
            });
        }
        case CHALLENGER_ID: {
            return updateState(state, {
                challengerId: action.payload
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
        case ROLLED_SEQUENCE: {
            return updateState(state, {
                rollSequence: action.payload
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
                        rollNumber: 'Roll',
                        rollSequence: null
                    });
                }
                return updateState(state, {
                    rollNumber: 'Roll',
                    rollSequence: null,
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
                numberOfPieces: action.payload.numberOfPieces,
                squares: action.payload.squares,
                piecePositions: action.payload.piecePositions,
                opponentSquares: action.payload.opponentSquares,
                numPiecesFinished: action.payload.finishedPieces,
                numOppPiecesFinished: action.payload.finishedOppPieces,
                winnerId: action.payload.winnerId,
                opponentDisconnect: action.payload.opponentDisconnect
            });
        }
        case UPDATE_NUMBER_OF_SPECTATORS: {
            return updateState(state, {
                numSpectators: action.payload
            });
        }
        case UPDATE_GAME_STATS: {
            return updateState(state, {
                gameStats: action.payload
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
