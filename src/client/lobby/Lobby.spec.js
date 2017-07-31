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
            challenger: [],
            challenging: [],
            winLossRecord: null
        }
    };

    it("Displays correct win/loss record for the user", () => {
        state.lobby.winLossRecord = {wins: 4, loses: 1};
        const store = mockStore(state);
        wrapper = shallow(<Lobby store={store}/>).shallow();
        expect(wrapper.find("h2").first().text()).toEqual(" Wins: 4 Loses: 1 ");
    });

    it("Clicking avatar opens up avatar editor", () => {
        const store = mockStore(state);
        wrapper = shallow(<Lobby store={store}/>).shallow();
        wrapper.find("canvas").at(0).simulate("click");
        expect(wrapper.state().drawCanvas).toEqual(true);
    });

});
