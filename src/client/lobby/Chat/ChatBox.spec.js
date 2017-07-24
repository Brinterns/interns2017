import React from 'react';
import { shallow } from 'enzyme';

import ChatBox from './ChatBox';

describe('<ChatBox />', () => {
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run']);
    });

    const message1 = {
        message: 'TestMessage',
        userName: 'Daniel'
    };
    const message2 = {
        message: 'TestMessage2',
        userName: 'David'
    };
    const message3 = {
        message: 'TestMessage3',
        userName: 'Darrel'
    };

    it('Base case - should not contain anything in the input', () => {
        const msgs = [];
        const wrapper = shallow(<ChatBox messages={msgs}/>);
        expect(wrapper.state().input).toEqual('');
    });

    it('Messages from input box update state correctly', () => {
        const msgs = [];
        const wrapper = shallow(<ChatBox messages={msgs}/>);
        wrapper.find("input").simulate("change", {target:{value:"test"}});
        expect(wrapper.state().input).toEqual('test');
    });

    it('Message divs passed as props are displayed', () => {
        const emptymsg = [];
        const emptywrapper = shallow(<ChatBox messages={emptymsg}/>);
        const defaultDivs = emptywrapper.find("div").length;
        const msgs = [message1, message2,message3];
        const wrapper = shallow(<ChatBox messages={msgs}/>);
        expect(wrapper.find("div").length).toEqual(defaultDivs + msgs.length);
    });

    it('Message message is displayed correctly', () => {
        const msgs = [message1, message2];
        const wrapper = shallow(<ChatBox messages={msgs}/>);
        const expectedMessage = " " + message1.message + " ";
        expect(wrapper.find("h2").first().text()).toEqual(expectedMessage);
    });
    
    it('Message username is displayed correctly', () => {
        const msgs = [message1, message2];
        const wrapper = shallow(<ChatBox messages={msgs}/>);
        const expectedMessage = " " + message1.userName + ": ";
        expect(wrapper.find("h1").first().text()).toEqual(expectedMessage);
    });


});
