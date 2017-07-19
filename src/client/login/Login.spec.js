import React from 'react';
import { shallow, mount } from 'enzyme';


import { Provider } from 'react-redux';
import sinon from 'sinon';
import expect from "expect";
import Login from './Login';

describe('<Login />', () => {
    let wrapper;
    let updateUsername;
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run']);
        updateUsername = jasmine.createSpy('updateUsername');
    });

    it('contains nothing in the input', () => {
        const store = {username : ''};
        wrapper = shallow(
            <Provider store={store}>
                <Login username={store.username}/>
            </Provider>
        );
        expect(wrapper.props().username).toEqual('');
    });
    it("sets the state properly after input", () => {
        const spy = expect.spyOn(Login.prototype, "handleChange");
        const stores = {username : ''};
        wrapper = shallow(<Login store={stores} username={stores.username}/>);
        expect(spy).toNotHaveBeenCalled();
        console.log("TEXT = " + wrapper.hasClass('Login'));
        wrapper.find("button").first().simulate("click");
        expect(spy).toHaveBeenCalled();
    });
});
