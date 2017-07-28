import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'
import Game from './Game';

const middlewares = [];
const mockStore = configureStore(middlewares);

describe('<Board />', () => {
    let wrapper;
    let state;
    beforeEach(() => {
        state = initialState;
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run', 'connected']);
    });

    const initialState = {
        game: {
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
            piecePositions: Array(7).fill(0),
            moveablePositions: [],
            numPiecesFinished: 0,
            numOppPiecesFinished: 0,
            //Notification states
            notificationBool: false,
            notificationText: null,
            opponentDisconnect: false
        }
    };

    it('Shows the right message if opponent disconnects', () => {
        state.game.winnerId = 1;
        state.game.opponentDisconnect = true;
        const store = mockStore(state);
        wrapper = shallow(<Game store={store}/>).shallow();
        expect(wrapper.find("h1").last().text()).toEqual(' Opponent Disconnected, You Won! ');
    })
});