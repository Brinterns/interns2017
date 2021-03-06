import React, { Component } from 'react';
import pageStyles from './Rules.css';
import p0img from '../images/rules/page0Img.png';
import p1img from '../images/rules/page1Img.png';
import p3img from '../images/rules/page3Img.png';

export function getPage(i, toggleRules, prevPage, nextPage) {
    var page = null;
    switch(i) {
        case 0:
            page = getPage0(toggleRules, nextPage);
            break;
        case 1:
            page = getPage1(toggleRules, prevPage, nextPage);
            break;
        case 2:
            page = getPage2(toggleRules, prevPage, nextPage);
            break;
        case 3:
            page = getPage3(toggleRules, prevPage, nextPage);
            break;
        default:
            page = null;
            break;
    }
    return(page);
}

function getPage0(toggleRules, nextPage) {
    return (
        <div className={pageStyles.rulesWindow}>
            <button className={pageStyles.exit} onClick={toggleRules}> &#x2716; </button>
            <div className={pageStyles.pageHolder}>
                <img src={p0img} className={pageStyles.page0Img} />
                <ul className={pageStyles.page0Text}>
                    <li> Each player has 7 pieces </li>
                    <li> The aim of the game is to move each piece from the start to the end of the board </li>
                    <li> The arrow in the image represents the path that each piece must follow </li>
                </ul>
            </div>
            <button className={pageStyles.next} onClick={nextPage}> &gt; </button>
        </div>
    );
}

function getPage1(toggleRules, prevPage, nextPage) {
    return (
        <div className={pageStyles.rulesWindow}>
            <button className={pageStyles.exit} onClick={toggleRules}> &#x2716; </button>
            <div className={pageStyles.pageHolder}>
                <ul className={pageStyles.pageText}>
                    <li> There are four, four cornered dice, each with white tips on two of the corners </li>
                    <li> Each turn you roll the dice and move a piece by the number of white tips facing up </li>
                    <li> The game represents this with a button that displays this number </li>
                    <li> The number rolled is how many squares you can move one piece forward </li>
                </ul>
                <img src={p1img} className={pageStyles.page1Img} />
            </div>
            <button className={pageStyles.prev} onClick={prevPage}> &#60; </button>
            <button className={pageStyles.next} onClick={nextPage}> &gt; </button>
        </div>
    );
}

function getPage2(toggleRules, prevPage, nextPage) {
    return (
        <div className={pageStyles.rulesWindow}>
            <button className={pageStyles.exit} onClick={toggleRules}> &#x2716; </button>
            <div className={pageStyles.pageHolder}>
                <ul className={pageStyles.pageText}>
                    <li> A move must be made unless it is impossible to do so </li>
                    <li> You must roll an exact number to leave the board </li>
                    <li> You cannot move a piece onto a square already occupied by one of your own pieces </li>
                    <li> If you land on a piece occupied by another opponent, the opposing piece is sent back to the start </li>
                </ul>
            </div>
            <button className={pageStyles.prev} onClick={prevPage}> &#60; </button>
            <button className={pageStyles.next} onClick={nextPage}> &gt; </button>
        </div>
    );
}

function getPage3(toggleRules, prevPage, nextPage) {
    return (
        <div className={pageStyles.rulesWindow}>
            <button className={pageStyles.exit} onClick={toggleRules}> &#x2716; </button>
            <div className={pageStyles.pageHolder}>
                <ul className={pageStyles.pageText}>
                    <li> The red squares on the board are special squares called Rosetta squares </li>
                    <li> If you land on a Rosetta you re-roll and move again (the same piece or another) </li>
                    <li> When a piece is on a Rosetta square, it cannot be taken by an opponent's piece </li>
                </ul>
                <img src={p3img} className={pageStyles.page3Img} />
            </div>
            <button className={pageStyles.prev} onClick={prevPage}> &#60; </button>
        </div>
    );
}
