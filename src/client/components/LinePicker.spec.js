import React from 'react';
import { shallow } from 'enzyme';
import LinePicker from './LinePicker';
import sinon from 'sinon';

describe('<LinePicker />', () => {
    let wrapper;

    it("Clicking on first line image should call setlinewidth function with value 1", () => {
        wrapper = shallow(<LinePicker setLineWidth={(val)=> {expect(val).toEqual(1)}}/>);
        const setLineWidth = sinon.spy();
        wrapper.find("img").at(0).simulate("click");
    });

    it("Clicking on second line image should call setlinewidth function with value 5", () => {
        wrapper = shallow(<LinePicker setLineWidth={(val)=> {expect(val).toEqual(5)}}/>);
        const setLineWidth = sinon.spy();
        wrapper.find("img").at(1).simulate("click");
    });

    it("Clicking on third line image should call setlinewidth function with value 15", () => {
        wrapper = shallow(<LinePicker setLineWidth={(val)=> {expect(val).toEqual(15)}}/>);
        const setLineWidth = sinon.spy();
        wrapper.find("img").at(2).simulate("click");
    });

    it("Clicking on fourth line image should call setlinewidth function with value 20", () => {
        wrapper = shallow(<LinePicker setLineWidth={(val)=> {expect(val).toEqual(20)}}/>);
        const setLineWidth = sinon.spy();
        wrapper.find("img").at(3).simulate("click");
    });

    it("Clicking on fifth line image should call setlinewidth function with value 30", () => {
        wrapper = shallow(<LinePicker setLineWidth={(val)=> {expect(val).toEqual(30)}}/>);
        const setLineWidth = sinon.spy();
        wrapper.find("img").at(4).simulate("click");
    });
});
