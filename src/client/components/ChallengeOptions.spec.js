import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import ChallengeOptions from './ChallengeOptions';

describe('<ChallengeOptions />', () => {
    let wrapper;

    it('Shows the plus and minus buttons for an in lobby user', () => {
        wrapper = shallow(<ChallengeOptions inChallenge={false} />);
        wrapper.setState({showOptions: true});
        expect(wrapper.find("button").first().text()).toEqual(" - ");
        expect(wrapper.find("button").last().text()).toEqual(" + ");
    });

    it('Shows the right number of pieces', () => {
        wrapper = shallow(<ChallengeOptions inChallenge={false} numberOfPieces={7} />);
        wrapper.setState({showOptions: true});
        expect(wrapper.find("label").text()).toEqual(" 7 ");
    });

    it('Shows the right number of pieces when the user is in a challenge', () => {
        wrapper = shallow(<ChallengeOptions inChallenge={true} challengePieces={3} />);
        wrapper.setState({showOptions: true});
        expect(wrapper.find("label").text()).toEqual(" 3 ");
    });

    it('Returns the right number of pieces when - is clicked', () => {
        wrapper = mount(<ChallengeOptions inChallenge={false} numberOfPieces={7} onChange={(num) => { expect(num).toEqual(6); }} />);
        wrapper.setState({showOptions: true});
        wrapper.find("button").first().simulate("click");
    });

    it('Returns the right number of pieces when + is clicked', () => {
        wrapper = mount(<ChallengeOptions inChallenge={false} numberOfPieces={7} onChange={(num) => { expect(num).toEqual(8); }} />);
        wrapper.setState({showOptions: true});
        wrapper.find("button").last().simulate("click");
    });

    it('Calls togglePowerUps if the power-ups input is clicked when not in challenge', () => {
        const togglePowerUps = sinon.spy();
        wrapper = shallow(<ChallengeOptions inChallenge={false} togglePowerUps={togglePowerUps} />);
        wrapper.setState({showOptions: true});
        wrapper.find("span").first().simulate("click");
        expect(togglePowerUps.callCount).toEqual(1);
    });

    it('Calls togglePath if the alternate path input is clicked when not in challenge', () => {
        const togglePath = sinon.spy();
        wrapper = shallow(<ChallengeOptions inChallenge={false} togglePath={togglePath} />);
        wrapper.setState({showOptions: true});
        wrapper.find("span").last().simulate("click");
        expect(togglePath.callCount).toEqual(1);
    });
});