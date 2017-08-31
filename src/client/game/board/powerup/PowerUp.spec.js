import React from 'react';
import { shallow } from 'enzyme';
import PowerUp from './PowerUp';

describe('<PowerUp />', () => {
    let wrapper;
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run', 'message']);
    });

    it('When power icon is clicked, the powerup clicked state is set to true', () => {
        wrapper = shallow(<PowerUp powerUp={"push"} useable={true} togglePowerUp={() => {}} />);
        expect(wrapper.state().powerUpClicked).toEqual(false);
        wrapper.find("div").at(2).simulate("click");
        expect(wrapper.state().powerUpClicked).toEqual(true);
    });
});
