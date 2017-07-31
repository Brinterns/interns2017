import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'
import Game from './Game';

const middlewares = [];
const mockStore = configureStore(middlewares);

describe('<Board />', () => {
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

    it('Shows the right message if opponent disconnects', () => {
        state.game.id = 1;
        state.game.winnerId = 1;
        state.game.opponentDisconnect = true;
        const store = mockStore(state);
        wrapper = shallow(<Game store={store}/>).shallow();
        expect(wrapper.find("h1").last().text()).toEqual(' Opponent Disconnected, You Won! ');
    });

    it('Shows re-challenge button at the end of the game', () => {
        state.game.id = 1;
        state.game.winnerId = 1;
        state.game.listOfPlayers = [{
            id: 2,
            name: 'Bob'
        }, {
            id: 3,
            name: 'Sam'
        }];
        const store = mockStore(state);
        wrapper = shallow(<Game store={store}/>).shallow();
        expect(wrapper.find("button").at(3).text()).toEqual(' Re-Challenge ');
    });

    it('Shows cancel button if user has re-challenged', () => {
        state.game.id = 1;
        state.game.winnerId = 1;
        state.game.listOfPlayers = [{
            id: 2,
            name: 'Bob'
        }, {
            id: 3,
            name: 'Sam'
        }];
        state.game.challengerId = 1;
        const store = mockStore(state);
        wrapper = shallow(<Game store={store}/>).shallow();
        expect(wrapper.find("button").at(3).text()).toEqual(' Cancel ');
    });

    it('Shows the right buttons if the user has been re-challenged', () => {
        state.game.id = 1;
        state.game.winnerId = 1;
        state.game.listOfPlayers = [{
            id: 2,
            name: 'Bob'
        }, {
            id: 3,
            name: 'Sam'
        }];
        state.game.challengerId = 2;
        const store = mockStore(state);
        wrapper = shallow(<Game store={store}/>).shallow();
        expect(wrapper.find("button").at(3).text()).toEqual(' \u2714 ');
        expect(wrapper.find("button").at(4).text()).toEqual(' \u2716 ');
    });
});