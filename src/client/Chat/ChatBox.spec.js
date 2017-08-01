import React from 'react';
import { shallow } from 'enzyme';

import ChatBox from './ChatBox';

describe('<ChatBox />', () => {
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run', 'message']);
    });

    const message1 = {
        message: 'TestMessage',
        userName: 'Daniel',
        userId: '1'
    };
    const message2 = {
        message: 'TestMessage2',
        userName: 'David',
        userId: '2'
    };
    const message3 = {
        message: 'TestMessage3',
        userName: 'Darrel',
        userId: '3'
    };

    it('Base case - should not contain anything in the input', () => {
        const msgs = [];
        const wrapper = shallow(<ChatBox messages={msgs}/>);
        expect(wrapper.state().input).toEqual('');
    });

    it('Clicking on chat should set open chat state to true', () => {
        const msgs = [];
        let wrapper = shallow (<ChatBox messages={msgs}/>);
        wrapper.find('div').at(1).simulate("click");
        expect(wrapper.state().showChat).toEqual(true);
    });

    it('Messages from input box update state correctly', () => {
        const msgs = [];
        let wrapper = shallow(<ChatBox messages={msgs}/>);
        wrapper.setState({
            showChat: true
        });
        wrapper.find("input").simulate("change", {target:{value:"test"}});
        expect(wrapper.state().input).toEqual('test');
    });

    it('Message divs passed as props are displayed', () => {
        const emptymsg = [];
        let emptywrapper = shallow(<ChatBox id={4} messages={emptymsg}/>);
        emptywrapper.setState({
            showChat: true
        });
        const defaultDivs = emptywrapper.find("div").length;
        const msgs = [message1, message2,message3];
        let wrapper = shallow(<ChatBox id={4} messages={msgs}/>);
        wrapper.setState({
            showChat: true
        });
        expect(wrapper.find("div").length).toEqual(defaultDivs + msgs.length*2);
    });

    it('Message message is displayed correctly', () => {
        const msgs = [message1, message2];
        const wrapper = shallow(<ChatBox id={4} messages={msgs}/>);
        wrapper.setState({
            showChat: true
        });
        const expectedMessage = message1.message;
        expect(wrapper.find("h5").first().text()).toEqual(expectedMessage);
    });

    it('Message username is displayed correctly', () => {
        const msgs = [message1, message2];
        let wrapper = shallow(<ChatBox id={4} messages={msgs}/>);
        wrapper.setState({
            showChat: true
        });
        const expectedMessage = message1.userName;
        expect(wrapper.find("h4").first().text()).toEqual(expectedMessage);
    });

    it('Message by player is displayed correctly', () => {
        const msgs = [message1, message2, message3];
        let wrapper = shallow(<ChatBox id={'3'} messages={msgs}/>);
        wrapper.setState({
            showChat: true
        });
        const expectedMessage = message3.message;
        expect(wrapper.find("h3").first().text()).toEqual(expectedMessage);
    });

    it('Correct notification number is displayed for unread messages', () => {
        const msgs = [message1, message2, message3];
        let wrapper = shallow(<ChatBox id={'4'} messages={msgs}/>);
        wrapper.setState({
            showChat: false,
            numMsgSeen: 1
        });
        expect(wrapper.find("p").at(1).text()).toEqual('2');
    });

    it('Message is sent and input reset on clicking send message icon', () => {
        let wrapper = shallow(<ChatBox id={'4'} messages={[]}/>);
        wrapper.setState({
            showChat: true,
            input: 'wadwadwadwad'
        });
        wrapper.find("img").at(2).simulate("click");
        expect(wrapper.state().input).toEqual('');
    });

    it('Show emojis set to true on clicking smiley emoji', () => {
        let wrapper = shallow(<ChatBox id={'7'} messages={[]}/>);
        wrapper.setState({
            showChat: true
        });
        wrapper.find("img").at(1).simulate("click");
        expect(wrapper.state().emojis).toEqual(true);
    });
});
