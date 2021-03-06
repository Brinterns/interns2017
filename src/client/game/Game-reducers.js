import {
    UPDATE_USER_ID,
    UPDATE_MOVE_ID,
    UPDATE_SPECTATING_ID,
    UPDATE_MESSAGES,
    UPDATE_LIST_OF_PLAYERS,
    UPDATE_CURRENT_PLAYER,
    UPDATE_CURRENT_PLAYER_ONLY,
    OPPONENT_DISCONNECT,
    GAME_OVER,
    CHALLENGER_DETAILS,
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
    UPDATE_SPECTATORS,
    OPPONENT_ROLLED_SEQUENCE,
    UPDATE_POWER_UPS,
    NEW_POWER_UP,
    ENABLE_POWER_UPS,
    UPDATE_POWER_UP_PIECES,
    UPDATE_ACTIVE_POWER_UPS,
    UPDATE_POWER_UP_NOTIFICATION,
    AUTO_RE_ROLL,
    OPPONENT_GHOST,
    GHOST,
    UPDATE_PATH_DATA
} from './Game-actions';


const numberOfPieces = 7;
const updateState = (currentState, newState) => Object.assign({}, currentState, newState);

const initialState = {
    messages: [],
    //Identity states
    id: null,
    moveId: null,
    spectatingId: null,
    currentPlayer: null,
    listOfPlayers: [],
    //Game over states
    gameOver : false,
    forfeit: false,
    winnerId: null,
    spectators: [],
    //Roll states
    rolled: true,
    rollNumber: 'Roll',
    opponentRollNumber: null,
    rollSequence: null,
    oppRollSequence: null,
    //Game states
    numberOfPieces: 7,
    squares: Array(24).fill(false),
    opponentSquares: Array(24).fill(false),
    piecePositions: Array(numberOfPieces).fill(0),
    moveablePositions: [],
    numPiecesFinished: 0,
    numOppPiecesFinished: 0,
    playerPath: [14, 17, 20, 23, 22, 19, 16, 13, 10, 7, 4, 1, 2, 5, 8],
    opponentPath: [12, 15, 18, 21, 22, 19, 16, 13, 10, 7, 4, 1, 0, 3, 6],
    finishingPosition: 15,
    //Notification states
    notificationBool: false,
    notificationName: "",
    notificationText: null,
    opponentDisconnect: false,
    challengerId: null,
    newNumberOfPieces: 7,
    powerUps: [],
    powerUp: null,
    enablePowerUps: false,
    newEnablePowerUps: false,
    newAlternatePath: false,
    powerUpPieces: [],
    activePowerUps: [],
    powerUpNotif: null,
    opponentGhostTurns: 0,
    ghostTurns: 0,
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
        case UPDATE_MOVE_ID: {
            return updateState(state, {
                moveId: action.payload
            });
        }
        case UPDATE_CURRENT_PLAYER: {
            return updateState(state, {
                currentPlayer: action.payload,
                rolled: false,
                powerUpPieces: []
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
        case CHALLENGER_DETAILS: {
            return updateState(state, {
                challengerId: action.payload[0],
                newNumberOfPieces: action.payload[1],
                newEnablePowerUps: action.payload[2],
                newAlternatePath: action.payload[3]
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
                rollSequence: action.payload,
                powerUpNotif: null
            });
        }
        case OPPONENT_ROLLED_SEQUENCE: {
            return updateState(state, {
                oppRollSequence: action.payload,
                notificationName: state.listOfPlayers.filter(player => {
                    return player.id === state.currentPlayer;
                })[0].name,
                notificationBool: false,
                powerUpNotif: null
            });
        }
        case OPPONENT_ROLLED_NUMBER: {
            return updateState(state, {
                opponentRollNumber: action.payload,
                notificationBool: true,
                oppRollSequence: null,
                notificationText: state.notificationName + " rolled a " + action.payload
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
                        oppRollSequence: null,
                        rollSequence: null
                    });
                }
                return updateState(state, {
                    rollNumber: 'Roll',
                    oppRollSequence: null,
                    rollSequence: null,
                    notificationText: "It's your turn!"
                });
            }
            return updateState(state, {
                notificationBool: false,
                opponentRollNumber: null
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
        case UPDATE_POWER_UP_NOTIFICATION: {
            if(state.currentPlayer !== state.id) {
                return updateState(state, {
                    notificationBool: action.payload[1],
                    powerUpNotif: action.payload[0]
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
                opponentDisconnect: action.payload.opponentDisconnect,
                opponentGhostTurns: action.payload.opponentGhostTurns,
                ghostTurns: action.payload.ghostTurns
            });
        }
        case UPDATE_PATH_DATA: {
            return updateState(state, {
                playerPath: action.payload.playerPath,
                opponentPath: action.payload.opponentPath,
                finishingPosition: action.payload.finalPosition
            });
        }
        case UPDATE_SPECTATORS: {
            return updateState(state, {
                spectators: action.payload
            });
        }
        case UPDATE_GAME_STATS: {
            return updateState(state, {
                gameStats: action.payload
            });
        }
        case UPDATE_POWER_UPS: {
            return updateState(state, {
                powerUps: action.payload
            });
        }
        case NEW_POWER_UP: {
            return updateState(state, {
                powerUp: action.payload
            });
        }
        case ENABLE_POWER_UPS: {
            return updateState(state, {
                enablePowerUps: action.payload
            });
        }
        case UPDATE_POWER_UP_PIECES: {
            return updateState(state, {
                powerUpPieces: action.payload
            });
        }
        case UPDATE_ACTIVE_POWER_UPS: {
            return updateState(state, {
                activePowerUps: action.payload
            });
        }
        case OPPONENT_GHOST: {
            return updateState(state, {
                opponentGhostTurns: action.payload
            });
        }
        case GHOST: {
            return updateState(state, {
                ghostTurns: action.payload
            });
        }
        case AUTO_RE_ROLL: {
            return updateState(state, {
                powerUpNotif: 'reroll',
                notificationBool: true
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
