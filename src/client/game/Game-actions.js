const namespace = "GAME/";
export const UPDATE_USER_ID = namespace + 'UPDATE_USER_ID';
export const UPDATE_MOVE_ID = namespace + 'UPDATE_MOVE_ID';
export const UPDATE_SPECTATING_ID = namespace + 'UPDATE_SPECTATING_ID';
export const UPDATE_LIST_OF_PLAYERS = namespace + 'UPDATE_LIST_OF_PLAYERS';
export const UPDATE_CURRENT_PLAYER = namespace + 'UPDATE_CURRENT_PLAYER';
export const UPDATE_CURRENT_PLAYER_ONLY = namespace + 'UPDATE_CURRENT_PLAYER_ONLY';
export const OPPONENT_DISCONNECT = namespace + 'OPPONENT_DISCONNECT';
export const GAME_OVER = namespace + 'GAME_OVER';
export const CHALLENGER_DETAILS = namespace + 'CHALLENGER_DETAILS';
export const TOGGLE_FORFEIT = namespace + 'TOGGLE_FORFEIT';
export const ROLLED_NUMBER = namespace + 'ROLLED_NUMBER';
export const UPDATE_GAME_STATE = namespace + 'UPDATE_GAME_STATE';
export const UPDATE_SQUARES = namespace + 'UPDATE_SQUARES';
export const UPDATE_OPPONENT_SQUARES = namespace + 'UPDATE_OPPONENT_SQUARES';
export const UPDATE_PIECE_POSITIONS = namespace + 'UPDATE_PIECE_POSITIONS';
export const UPDATE_MOVEABLE_POSITIONS = namespace + 'UPDATE_MOVEABLE_POSITIONS';
export const UPDATE_NUM_FINISHED = namespace + 'UPDATE_NUM_FINISHED';
export const UPDATE_NUM_OPPONENT_FINISHED = namespace + 'UPDATE_NUM_OPPONENT_FINISHED';
export const RESET_ROLL_TEXT = namespace + 'RESET_ROLL_TEXT';
export const OPPONENT_ROLLED_NUMBER = namespace + 'OPPONENT_ROLLED_NUMBER';
export const RESET_NOTIFICATION_BOOL = namespace + 'RESET_NOTIFICATION_BOOL';
export const RESET_STORE = namespace + 'RESET_STORE';
export const UPDATE_MESSAGES = namespace + 'UPDATE_MESSAGES';
export const ROLLED_SEQUENCE = namespace + 'ROLLED_SEQUENCE';
export const UPDATE_GAME_STATS = namespace + 'UPDATE_GAME_STATS';
export const UPDATE_SPECTATORS = namespace + 'UPDATE_SPECTATORS';
export const OPPONENT_ROLLED_SEQUENCE = namespace + 'OPPONENT_ROLLED_SEQUENCE';

export function updateUserGameId(id) {
    return {
        type: UPDATE_USER_ID,
        payload: id
    }
}

export function updateMoveId(id) {
    return {
        type: UPDATE_MOVE_ID,
        payload: id
    }
}

export function spectatingId(id) {
    return {
        type: UPDATE_SPECTATING_ID,
        payload: id
    }
}

export function updateSpectators(spectators) {
    return {
        type: UPDATE_SPECTATORS,
        payload: spectators
    }
}

export function updateGameMessages(messages) {
    return {
        type: UPDATE_MESSAGES,
        payload: messages
    }
}

export function toggleForfeit() {
    return {
        type: TOGGLE_FORFEIT
    }
}

export function resetRollText() {
    return {
        type: RESET_ROLL_TEXT
    }
}

export function rollSequence(sequence) {
    return {
        type: ROLLED_SEQUENCE,
        payload: sequence
    }
}

export function oppRollSequence(sequence) {
    return {
        type: OPPONENT_ROLLED_SEQUENCE,
        payload: sequence
    }
}

export function resetNotificationBool() {
    return {
        type: RESET_NOTIFICATION_BOOL
    }
}

export function updateGameStats(stats) {
    return {
        type: UPDATE_GAME_STATS,
        payload: stats
    }
}

export function updateListOfPlayers(listOfPlayers) {
    return {
        type: UPDATE_LIST_OF_PLAYERS,
        payload: listOfPlayers
    }
}

export function rolledValue(value) {
    return {
        type: ROLLED_NUMBER,
        payload: value
    }
}

export function opponentRolled(value) {
    return {
        type: OPPONENT_ROLLED_NUMBER,
        payload: value
    }
}

export function updateCurrentPlayer(current) {
    return {
        type: UPDATE_CURRENT_PLAYER,
        payload: current
    }
}

export function updateCurrentPlayerOnly(current) {
    return {
        type: UPDATE_CURRENT_PLAYER_ONLY,
        payload: current
    }
}

export function opponentDisconnect() {
    return {
        type: OPPONENT_DISCONNECT
    }
}

export function gameOver(winnerId) {
    return {
        type: GAME_OVER,
        payload: winnerId
    }
}

export function challengerDetails(challengerId) {
    return {
        type: CHALLENGER_DETAILS,
        payload: challengerId
    }
}

export function updateSquares(squares) {
    return {
        type: UPDATE_SQUARES,
        payload: squares
    }
}

export function updateOpponentSquares(squares){
    return {
        type: UPDATE_OPPONENT_SQUARES,
        payload: squares
    }
}

export function updateMoveablePositions(positions) {
    return {
        type: UPDATE_MOVEABLE_POSITIONS,
        payload: positions
    }
}

export function updatePiecePositions(positions) {
    return {
        type: UPDATE_PIECE_POSITIONS,
        payload: positions
    }
}

export function updateFinishedPieces(numPiecesFinished) {
    return {
        type: UPDATE_NUM_FINISHED,
        payload: numPiecesFinished
    }
}

export function updateOppFinishedPieces(numPiecesFinished) {
    return {
        type: UPDATE_NUM_OPPONENT_FINISHED,
        payload: numPiecesFinished
    }
}

export function resetStore() {
    return {
        type: RESET_STORE
    }
}

export function updateGameState(gameState) {
    return {
        type: UPDATE_GAME_STATE,
        payload: gameState
    }
}
