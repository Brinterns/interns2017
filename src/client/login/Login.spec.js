import React from 'react';
import { shallow, mount } from 'enzyme';
import _ from 'underscore';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'
import Login from './Login';

const middlewares = [];
const mockStore = configureStore(middlewares);

describe('<Login />', () => {
    let wrapper;
    let updateUsername;
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run', 'connected']);
        updateUsername = jasmine.createSpy('updateUsername');
    });

    it("Dispatches action when input box value changes", () => {
        const initialState = {
            login: {
                username: ''
            }
        };
        const store = mockStore(initialState);
        wrapper = shallow(<Login store={store}/>).shallow();
        wrapper.find("input").first().simulate("change", {target:{value:"test"}});
        expect(_.isEqual(store.getActions(), [{type: 'LOGIN/UPDATE_USERNAME_TEXT', payload: 'test'}])).toEqual(true);
    });
});
