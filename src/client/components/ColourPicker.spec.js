import React from 'react';
import { shallow } from 'enzyme';
import ColourPicker from './ColourPicker';
import sinon from 'sinon';

describe('<ColourPicker />', () => {
    let wrapper;

    it("Clicking on pink circle should call func colourSelected with arg pink", () => {
        wrapper = shallow(<ColourPicker colourSelected={(colour)=> {expect(colour).toEqual("pink")}}/>);
        wrapper.find("div").at(2).simulate("click");
    });

    it("Clicking x button calls toggle picker func", () => {
        const togglePicker = sinon.spy();
        wrapper = shallow(<ColourPicker togglePicker={togglePicker}/>);
        wrapper.find("button").at(0).simulate("click");
        expect(togglePicker.callCount).toEqual(1);
    });
});
