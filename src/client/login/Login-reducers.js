import { UPDATE_USERNAME_TEXT } from './Login-actions';

const updateState = (currentState, newState) => Object.assign({}, currentState, newState);

const initialState = {
	username: ''
};

const login = (state = initialState, action) => {
    switch(action.type) {
        case UPDATE_USERNAME_TEXT: {
            return updateState(state, {
                username: action.payload
            });
        }
        default: {
            return state;
        }
    }
}

export default login;
