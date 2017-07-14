import React from 'react';
import { shallow } from 'enzyme';

import Login from './Login';

describe('<Login />', () => {
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run']);
    });

    it('contains nothing in the input', () => {
        const wrapper = shallow(<Login />);
        expect(wrapper.state().username).toEqual('');
    });
    it("sets the state properly after input", () => {
        const wrapper = shallow(<Login />);
        wrapper.find("input").first().simulate("change", {target:{value:"test"}});
        expect(wrapper.state().username).toEqual("test");
    });
});
