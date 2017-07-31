import React from 'react';
import { shallow } from 'enzyme';
import _ from 'underscore';
import configureStore from 'redux-mock-store'
import Board from './Board';

const middlewares = [];
const mockStore = configureStore(middlewares);

describe('<Board />', () => {
    let wrapper;
    let state;
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run']);
        state = {
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
    });
    
    it('Default display for roll button should be (Roll)', () => {
        const store = mockStore(state);
        wrapper = shallow(<Board store={store}/>).shallow();
        expect(wrapper.find("button").text()).toEqual('Roll');
    });
    
    it('When a rolled value is passed to board, it is displayed in the button', () => {
        state.game.rollNumber = '3';
        const store = mockStore(state);
        wrapper = shallow(<Board store={store}/>).shallow();
        expect(wrapper.find("button").text()).toEqual('3');
    });
});
