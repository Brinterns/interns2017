import React from 'react';
import { shallow } from 'enzyme';
import RollFlash from './RollFlash';
import _ from 'underscore';

describe('<RollFlash />', () => {
    let wrapper;
    let state;
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run']);
    });

    it('When a rolled value is passed to board, it is displayed inside the roll div', () => {
        wrapper = shallow(<RollFlash rollNumber={'3'} sequence={'1'.repeat(4)}    />).shallow();
        expect(wrapper.find("h1").text()).toEqual('3');
    });
});
