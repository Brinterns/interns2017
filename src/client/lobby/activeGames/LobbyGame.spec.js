import React from 'react';
import { shallow } from 'enzyme';
import LobbyGame from './LobbyGame';

describe('<LobbyGame />', () => {
    let wrapper;
    let state;

    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run', 'connected', 'message']);
    });

    it("Hovering over eye image sets minimap state to true", () => {
        const game = {
            id: '1',
            name: 'foo vs bar',
            game: {}
        }
        wrapper = shallow(<LobbyGame game={game}/>);
        wrapper.find("img").simulate('mouseEnter');
        expect(wrapper.state().showMiniMap).toEqual(true);
    });

    it("Hovering over img should set to true then removing mouse should set to false", () => {
        const game = {
            id: '1',
            name: 'foo vs bar',
            game: {}
        }
        wrapper = shallow(<LobbyGame game={game}/>);
        wrapper.find("img").simulate('mouseEnter');
        expect(wrapper.state().showMiniMap).toEqual(true);
        wrapper.find("img").simulate('mouseLeave');
        expect(wrapper.state().showMiniMap).toEqual(false);
    });

    it("Correct game name is displayed", () => {
        const game = {
            id: '1',
            name: 'foo vs bar',
            game: {}
        }
        expect(wrapper.find("h1").first().text()).toEqual(" foo vs bar ");
    });
});
