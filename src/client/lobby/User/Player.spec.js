import React from 'react';
import { shallow } from 'enzyme';

import Player from './Player';

describe('<Player />', () => {
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run']);
    });

    const PlayerProp = {
        name: "Foo",
    };

    it('Given username is displayed correctly', () => {
        const wrapper = shallow (<Player name={PlayerProp.name}/>);
        expect(wrapper.find("h1").text()).toEqual(" Foo ");
    });

    it('Clicking on name should set clicked state to true', () => {
        let wrapper = shallow (<Player name={PlayerProp.name}/>);
        wrapper.find("h1").simulate("click");
        expect(wrapper.state().clicked).toEqual(true);
    });

    it('Clicking on name should display input field with username already inserted', () => {
        let wrapper = shallow (<Player name={PlayerProp.name}/>);
        wrapper.find("h1").simulate("click");
        wrapper.update();
        expect(wrapper.find("input").props().value).toEqual("Foo");
    });

});
