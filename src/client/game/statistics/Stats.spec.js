import React from 'react';
import { shallow } from 'enzyme';
import Stats from './Stats';

describe('<Stats />', () => {
    let wrapper;
    let stats = {};
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run', 'connected']);
        stats.playerIds = [1,2];
        const initalPlayerState = {
            piecesTaken: 0,
            piecesLost: 0,
            squaresMoved: 8,
            turnsTaken: 2,
            turnsInEndRange: 0,
            turnsLastInEndRange: 0,
            numberOfRolls: 3,
            totalTimeTaken: 15,
            name: null
        }
        stats.players = [Object.assign({}, initalPlayerState), Object.assign({}, initalPlayerState)];
        stats.players[0].name = "Foo";
        stats.players[1].name = "Bar";
    });

    it("Toggling checkboard img triggers stats state to be set to true", () => {
        let wrapper = shallow(<Stats stats={stats} id={1} />);
        wrapper.find("img").simulate("click");
        expect(wrapper.state().statsDisplay).toEqual(true);
    });

    it("Toggling back img triggers stats state to be set to false", () => {
        let wrapper = shallow(<Stats stats={stats} id={1} />);
        wrapper.setState({
            statsDisplay: true
        });
        wrapper.find("img").simulate("click");
        expect(wrapper.state().statsDisplay).toEqual(false);
    });

    it("Table of statistics should contain 7 rows", () => {
        let wrapper = shallow(<Stats stats={stats} id={1} />);
        wrapper.setState({
            statsDisplay: true
        });
        expect(wrapper.find("tr").length).toEqual(7);
    });

    it("Average square moves per turn displayed has correct value", () => {
        let wrapper = shallow(<Stats stats={stats} id={1} />);
        wrapper.setState({
            statsDisplay: true
        });
        expect(wrapper.find("tr").at(1).find("td").at(0).text()).toEqual("4.0");
    });

    it("Average time taken per roll displayed has correct value", () => {
        let wrapper = shallow(<Stats stats={stats} id={1} />);
        wrapper.setState({
            statsDisplay: true
        });
        expect(wrapper.find("tr").at(6).find("td").at(0).text()).toEqual("5.0");
    });
});
