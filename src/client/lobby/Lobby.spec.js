import React from 'react';
import { shallow } from 'enzyme';
import Lobby from './Lobby';
import configureStore from 'redux-mock-store'

const middlewares = [];
const mockStore = configureStore(middlewares);

describe('<Lobby />', () => {
    let wrapper;
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run', 'connected']);
    });

    it("Displays correct win/loss record for the user", () => {
        const initialState = {
            lobby: {
                id: null,
                listOfUsers: [],
                listOfActiveGames: [],
                messages: [],
                ready: false,
                winLossRecord: {wins: 4, loses: 1}
            }
        };
        const store = mockStore(initialState);
        wrapper = shallow(<Lobby store={store}/>).shallow();
        expect(wrapper.find("h2").first().text()).toEqual(" Wins: 4 Loses: 1 ");
    });
});
