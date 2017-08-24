import React from 'react';
import { shallow } from 'enzyme';
import PowerUpInfo from './PowerUpInfo';

describe('<PowerUpInfo />', () => {
    let wrapper;
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run', 'message']);
    });

    it('When info icon is hovered on, info display state is set to true', () => {
        wrapper = shallow(<PowerUpInfo />);
        expect(wrapper.state().infoDisplay).toEqual(false);
        wrapper.find("img").at(0).simulate("mouseEnter");
        expect(wrapper.state().infoDisplay).toEqual(true);
    });

    it('When info icon is hovered on, 4 images should display', () => {
        wrapper = shallow(<PowerUpInfo />);
        const lenBefore = wrapper.find("img").length;
        wrapper.find("img").at(0).simulate("mouseEnter");
        expect(wrapper.find("img").length).toEqual(lenBefore + 4);
    });
});
