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
});
