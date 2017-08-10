import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'
import GameSpectate from './GameSpectate';

const middlewares = [];
const mockStore = configureStore(middlewares);

describe('<GameSpectate />', () => {
    let state;
    let wrapper;
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run', 'connected']);
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
                opponentDisconnect: false,
                challengerId: null
            }
        };
    });

    it('Shows the right current player text', () => {
        state.game.listOfPlayers = [{
            id: 1,
            name: 'bob'
        }];
        state.game.currentPlayer = 1;
        const store = mockStore(state);
        wrapper = shallow(<GameSpectate store={store}/>).shallow();
        expect(wrapper.find("h1").first().text()).toEqual(" It's bob's turn ");
    });

    it('Shows the right player in top left', () => {
        state.game.listOfPlayers = [{
            id: 1,
            name: 'bob',
            elorank: 1111
        }];
        const store = mockStore(state);
        wrapper = shallow(<GameSpectate store={store}/>).shallow();
        expect(wrapper.find("li").first().text()).toEqual(" bob (1111)  ");
    });

    it('Shows the leave button in top right', () => {
        const store = mockStore(state);
        wrapper = shallow(<GameSpectate store={store}/>).shallow();
        expect(wrapper.find("button").first().text()).toEqual(" Leave ");
    });
});
