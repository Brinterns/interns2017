import React from 'react';
import { shallow } from 'enzyme';

import Board from './Board';

describe('<Board />', () => {
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run']);
    });

    const DefaultBoardProps = {
        rollNumber: 'Roll'
    };

    // it('Default display for roll button should be (Roll)', () => {
    //     const wrapper = shallow(<Board rollNumber={DefaultBoardProps.rollNumber}/>);
    //     expect(wrapper.find("button").text()).toEqual('Roll');
    // });
    //
    // const RolledNumberProps = {
    //     rollNumber: '3'
    // };
    //
    // it('When a rolled value is passed to board, it is displayed in the button', () => {
    //     const wrapper = shallow(<Board rollNumber={RolledNumberProps.rollNumber}/>);
    //     expect(wrapper.find("button").text()).toEqual('3');
    // });
    //
    // const NotPlayerTurnProps = {
    //     rolled: false,
    //     isPlayerTurn: false
    // };
    //
    // it('Clicking button when it a players turn should do nothing' , () => {
    //     const wrapper = shallow(<Board isPlayerTurn={NotPlayerTurnProps.isPlayerTurn} rolled={NotPlayerTurnProps.rolled}/>);
    //     wrapper.find("button").simulate('click');
    // });
    //
    // const RolledPlayerTurnProps = {
    //     rolled: true,
    //     isPlayerTurn: true
    // };
    //
    // it('Clicking button when it a players turn but he has already rolled should do nothing' , () => {
    //     const wrapper = shallow(<Board isPlayerTurn={RolledPlayerTurnProps.isPlayerTurn} rolled={RolledPlayerTurnProps.rolled}/>);
    //     wrapper.find("button").simulate('click');
    // });



});
