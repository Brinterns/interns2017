import React from 'react';
import { shallow } from 'enzyme';

import User from './User';

describe('<User />', () => {
    var user;
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run']);
        user = userProp;
    });

    const userProp = {
        name: "Samuel",
        elorank: 1200,
        winLossRecord: {wins: 0, loses: 0}
    };

    it('Given username is displayed correctly', () => {
        const wrapper = shallow(<User user={user} />);
        expect(wrapper.find("h1").text()).toEqual(" " + userProp.name + " ");
    });

    it('Shows the right button when the user is not in a challenge', () => {
        const wrapper = shallow(<User user={user} />);
        expect(wrapper.find("button").text()).toEqual(" Challenge ");
    });

    it('Shows the right button when the user makes a challenge', () => {
        const wrapper = shallow(<User user={user} challenging={true} />);
        expect(wrapper.find("button").text()).toEqual(" Cancel ");
    });

    it('Shows the right buttons when the user has been challenged', () => {
        const wrapper = shallow(<User user={user} challenged={true} />);
        expect(wrapper.find("button").first().text()).toEqual(" \u2716 ");
        expect(wrapper.find("button").last().text()).toEqual(" \u2714 ");
    });
});
