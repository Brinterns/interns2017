import React from 'react';
import { shallow } from 'enzyme';
import DrawCanvas from './DrawCanvas';

describe('<DrawCanvas />', () => {
    let wrapper;
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run', 'connected']);
    });

    it("Toggling colour button sets colour picker state to true", () => {
        wrapper = shallow(<DrawCanvas />);
        wrapper.find("button").first().simulate("click");
        expect(wrapper.state().showPicker).toEqual(true);
    });
});
