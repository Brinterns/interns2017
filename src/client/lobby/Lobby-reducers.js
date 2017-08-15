import {
    UPDATE_MESSAGES,
    UPDATE_USER_ID,
    UPDATE_ROOM_NAMES,
    UPDATE_USERS,
    UPDATE_CHALLENGING,
    UPDATE_CHALLENGERS,
    UPDATE_MINI_MAP
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
    elorank: null,
    //game states
    roomId: null,
    opponentDisconnect: false,
    winnerId: null,
    squares: Array(24).fill(false),
    opponentSquares: Array(24).fill(false),
    piecePositions: Array(7).fill(0),
    moveablePositions: [],
    numPiecesFinished: 0,
    numOppPiecesFinished: 0,
    name: null,
    opponentName: null
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
        case UPDATE_MINI_MAP: {
            return updateState(state, {
                roomId: action.payload.roomId,
                squares: action.payload.squares,
                piecePositions: action.payload.piecePositions,
                opponentSquares: action.payload.opponentSquares,
                numPiecesFinished: action.payload.finishedPieces,
                numOppPiecesFinished: action.payload.finishedOppPieces,
                winnerId: action.payload.winnerId,
                opponentDisconnect: action.payload.opponentDisconnect,
                name: action.payload.name,
                opponentName: action.payload.opponentName
            });
        }
        default: {
            return state;
        }
    }
}

export default lobby;
