import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import configureStore from 'redux-mock-store'
import LobbyDisplay from './LobbyDisplay';

const middlewares = [];
const mockStore = configureStore(middlewares);

describe('<LobbyDisplay />', () => {
    let wrapper;
    let state;
    beforeEach(() => {
        state = {
            lobby: {
                challenger: [],
                challenging: []
            }
        };
    });

    it("Calls toggleSortRank when the sort label is clicked", () => {
        const store = mockStore(state);
        const toggleSortRank = sinon.spy();
        wrapper = shallow(<LobbyDisplay store={store} users={[]} toggleSortRank={toggleSortRank} />).shallow();
        wrapper.find("label").first().simulate("click");
        expect(toggleSortRank.callCount).toEqual(1);
    });
    
    it("Calls toggleFilterOnline when the sort label is clicked", () => {
        const store = mockStore(state);
        const toggleFilterOnline = sinon.spy();
        wrapper = shallow(<LobbyDisplay store={store} users={[]} toggleFilterOnline={toggleFilterOnline} />).shallow();
        wrapper.find("input").first().simulate("click");
        expect(toggleFilterOnline.callCount).toEqual(1);
    });
});
