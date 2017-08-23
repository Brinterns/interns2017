import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'
import Game from './Game';

const middlewares = [];
const mockStore = configureStore(middlewares);

describe('<Game />', () => {
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
                spectators: [],
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
                challengerId: null,
                powerUpNotif: null
            }
        };
    });

    it('Shows the right message if opponent disconnects', () => {
        state.game.id = 1;
        state.game.winnerId = 1;
        state.game.opponentDisconnect = true;
        const store = mockStore(state);
        wrapper = shallow(<Game store={store}/>).shallow();
        expect(wrapper.find("p").first().text()).toEqual(' Opponent Left, You Won! ');
    });

    it('Shows re-challenge button at the end of the game', () => {
        state.game.id = 1;
        state.game.winnerId = 1;
        state.game.listOfPlayers = [{
            id: 1,
            name: 'Bob'
        }, {
            id: 2,
            name: 'Sam'
        }];
        const store = mockStore(state);
        wrapper = shallow(<Game store={store}/>).shallow();
        expect(wrapper.find("button").at(2).text()).toEqual(' Re-Challenge ');
    });

    it('Shows cancel button if user has re-challenged', () => {
        state.game.id = 1;
        state.game.winnerId = 1;
        state.game.listOfPlayers = [{
            id: 1,
            name: 'Bob'
        }, {
            id: 2,
            name: 'Sam'
        }];
        state.game.challengerId = 1;
        const store = mockStore(state);
        wrapper = shallow(<Game store={store}/>).shallow();
        expect(wrapper.find("button").at(2).text()).toEqual(' Cancel ');
    });

    it('Shows the right buttons if the user has been re-challenged', () => {
        state.game.id = 1;
        state.game.winnerId = 1;
        state.game.listOfPlayers = [{
            id: 1,
            name: 'Bob'
        }, {
            id: 2,
            name: 'Sam'
        }];
        state.game.challengerId = 2;
        const store = mockStore(state);
        wrapper = shallow(<Game store={store}/>).shallow();
        expect(wrapper.find("button").at(2).text()).toEqual(' \u2714 ');
        expect(wrapper.find("button").at(3).text()).toEqual(' \u2716 ');
    });

    it('Toggles power-ups if the image is clicked', () => {
        state.game.id = 1;
        state.game.winnerId = 1;
        state.game.listOfPlayers = [{
            id: 1,
            name: 'Bob'
        }, {
            id: 2,
            name: 'Sam'
        }];
        const store = mockStore(state);
        wrapper = shallow(<Game store={store}/>).shallow();
        wrapper.find("img").first().simulate("click");
        expect(wrapper.state().enablePowerUps).toEqual(true);
    })

    it('Shows the correct number of spectators', () => {
        state.game.spectators = ['John', 'Matt', 'Test'];
        const store = mockStore(state);
        wrapper = shallow(<Game store={store}/>).shallow();
        expect(wrapper.find("p").at(0).text()).toEqual(' Spectators (3) ');
    });

    it('Shows the correct notification text when oppoennt uses power up', () => {
        state.game.id = 1;
        state.game.listOfPlayers = [{
            id: 1,
            name: 'Bob'
        }, {
            id: 2,
            name: 'Sam'
        }];
        state.game.currentPlayer = 2;
        state.game.powerUpNotif = "push";
        state.game.notificationBool = true;
        const store = mockStore(state);
        wrapper = shallow(<Game store={store}/>).shallow();
        expect(wrapper.find("p").at(2).text()).toEqual('Sam used ');
    });
});
