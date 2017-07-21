import React from 'react';
import { shallow } from 'enzyme';
import Lobby from './Lobby';
import configureStore from 'redux-mock-store'

const middlewares = [];
const mockStore = configureStore(middlewares);

describe('<Lobby />', () => {
    let wrapper;
    let state;
    beforeEach(() => {
        state = initialState;
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run', 'connected']);
    });

    const initialState = {
        lobby: {
            id: null,
            listOfUsers: [],
            listOfActiveGames: [],
            messages: [],
            ready: false,
            challenger: null,
            challenging: false,
            winLossRecord: null
        }
    };

    it("Displays correct win/loss record for the user", () => {
        state.lobby.winLossRecord = {wins: 4, loses: 1};
        const store = mockStore(state);
        wrapper = shallow(<Lobby store={store}/>).shallow();
        expect(wrapper.find("h2").first().text()).toEqual(" Wins: 4 Loses: 1 ");
    });

    it("Displays correct waiting notification when user makes a challenge", () => {
        state.lobby.challenging = true;
        const store = mockStore(state);
        wrapper = shallow(<Lobby store={store}/>).shallow();
        expect(wrapper.find("h1").last().text()).toEqual(" Waiting for response... ");
    });

    it("Displays correct challenge notification when user is challenged", () => {
        state.lobby.listOfUsers = [{
            id: 'abc123',
            name: 'Bob',
            ready: false,
            winLossRecord: {wins: 0, loses: 0}
        }];
        state.lobby.ready = true;
        state.lobby.challenger = 'abc123';
        const store = mockStore(state);
        wrapper = shallow(<Lobby store={store}/>).shallow();
        expect(wrapper.find("h1").last().text()).toEqual(" Bob has challenged you ");
    });
});
