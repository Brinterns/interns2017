import React from 'react';
import { shallow } from 'enzyme';

import User from './User';

describe('<User />', () => {
    var user;
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run']);
        user = {
            name: "Samuel",
            elorank: 1200,
            winLossRecord: {wins: 0, loses: 0},
            inLobby: true,
            online: true,
            isMe: false,
            rank: 5
        };
    });

    it('Given username is displayed correctly', () => {
        const wrapper = shallow(<User user={user} />);
        expect(wrapper.find("h1").text()).toEqual(" " + user.name + " ");
    });

    it('Shows the right ELO rating and rank', () => {
        user.elorank = 1198;
        const wrapper = shallow(<User user={user} />);
        expect(wrapper.find("h2").at(0).text()).toEqual(" Rating: 1198 #5 ");
    });

    it('Shows the right win/loss record', () => {
        user.winLossRecord = {wins: 2, loses: 1};
        const wrapper = shallow(<User user={user} />);
        expect(wrapper.find("h2").at(1).text()).toEqual(" W: 2 L: 1 ");
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

    it('Shows the right name when the other user is in a game', () => {
        user.inLobby = false;
        const wrapper = shallow(<User user={user} challenging={true} />);
        expect(wrapper.find("h1").text()).toEqual(" " + user.name + " (In-Game) ");
    });

    it('Shows the right name when the other user is offline', () => {
        user.online = false;
        user.inLobby = false;
        const wrapper = shallow(<User user={user} challenging={true} />);
        expect(wrapper.find("h1").text()).toEqual(" " + user.name + " (Offline) ");
    });

    it('Shows the right name when the user you', () => {
        user.isMe = true;
        const wrapper = shallow(<User user={user} challenging={true} />);
        expect(wrapper.find("h1").text()).toEqual(" " + user.name + " (You) ");
    });
});
