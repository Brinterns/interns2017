import React from 'react';
import { shallow } from 'enzyme';

import User from './User';

describe('<User />', () => {
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run']);
    });

    const userProp = {
        name: "Samuel",
        ready: false,
        winLossRecord: {wins: 0, loses: 0}
    };

    it('Given username is displayed correctly', () => {
        const wrapper = shallow (<User user={userProp}/>);
        expect(wrapper.find("h1").text()).toEqual(" " + userProp.name + " ");
    });
});
