import React from 'react';
import { shallow } from 'enzyme';
import LinePicker from './LinePicker';

describe('<LinePicker />', () => {
    let wrapper;

    it("Clicking on first line image should call setlinewidth function with value 1", () => {
        wrapper = shallow(<LinePicker setLineWidth={(val)=> {expect(val).toEqual(1)}}/>);
        wrapper.find("img").at(0).simulate("click");
    });

    it("Clicking on second line image should call setlinewidth function with value 5", () => {
        wrapper = shallow(<LinePicker setLineWidth={(val)=> {expect(val).toEqual(5)}}/>);
        wrapper.find("img").at(1).simulate("click");
    });

    it("Clicking on third line image should call setlinewidth function with value 15", () => {
        wrapper = shallow(<LinePicker setLineWidth={(val)=> {expect(val).toEqual(15)}}/>);
        wrapper.find("img").at(2).simulate("click");
    });

    it("Clicking on fourth line image should call setlinewidth function with value 20", () => {
        wrapper = shallow(<LinePicker setLineWidth={(val)=> {expect(val).toEqual(20)}}/>);
        wrapper.find("img").at(3).simulate("click");
    });

    it("Clicking on fifth line image should call setlinewidth function with value 30", () => {
        wrapper = shallow(<LinePicker setLineWidth={(val)=> {expect(val).toEqual(30)}}/>);
        wrapper.find("img").at(4).simulate("click");
    });
});
