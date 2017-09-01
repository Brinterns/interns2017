import React from 'react';
import { shallow } from 'enzyme';
import _ from 'underscore';
import configureStore from 'redux-mock-store'
import BoardSpectate from './BoardSpectate';

const middlewares = [];
const mockStore = configureStore(middlewares);

describe('<BoardSpectate />', () => {
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
                opponentDisconnect: false,
                powerUps: [],
                activePowerUps: [],
                playerPath: [14, 17, 20, 23, 22, 19, 16, 13, 10, 7, 4, 1, 2, 5, 8],
                opponentPath: [12, 15, 18, 21, 22, 19, 16, 13, 10, 7, 4, 1, 0, 3, 6],
                finishingPosition: 15
            }
        };
    });

    it('Shows the right name next to the bottom pieces', () => {
        const store = mockStore(state);
        wrapper = shallow(<BoardSpectate store={store} spectatingName = 'bob' />).shallow();
        expect(wrapper.find("p").last().text()).toEqual(" bob ");
    });
});
