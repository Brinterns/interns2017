import React, { Component } from 'react';
import pageStyles from './Rules.css';
import p0img from '../images/rules/page0Img.png';

export function getPage(i, closeRules) {
    var page = null;
    switch(i) {
        case 0:
            page = getPage0(closeRules);
            break;
        case 1:
            page = getPage1(closeRules);
            break;
        case 2:
            page = getPage2(closeRules);
            break;
        case 3:
            page = getPage3(closeRules);
            break;
        case 4:
            page = getPage4(closeRules);
            break;
        default:
            page = null;
            break;
    }
    return(page);
}

function getPage0(closeRules) {
    return (
        <div className={pageStyles.rulesWindow}>
            <button className={pageStyles.exit} onClick={closeRules}> X </button>
            <img src={p0img} className={pageStyles.page0Img} />
            <ul className={pageStyles.page0Text}>
                <li> Each player has 7 pieces </li>
                <li> The aim of the game is to move each piece from the start to the end of the board </li>
                <li> The arrow in the image represents the path that each piece must follow </li>
            </ul>
        </div>
    );
}

function getPage1(closeRules) {
    return (
        <div className={pageStyles.rulesWindow}>
            <button className={pageStyles.exit} onClick={closeRules}> X </button>
            <ul className={pageStyles.pageText}>
                <li> There are four, four cornered dice, each with white tips on two of the corners </li>
                <li> Each turn you roll the dice and move a piece by the number of white tips facing up </li>
                <li> The game represents this with a button that displays this number </li>
                <li> The number rolled is how many squares you can move one piece forward </li>
            </ul>
        </div>
    );
}

function getPage2(closeRules) {
    return (
        <div className={pageStyles.rulesWindow}>
            <button className={pageStyles.exit} onClick={closeRules}> X </button>
            <ul className={pageStyles.pageText}>
                <li> A move must be made unless it is impossible to do so </li>
                <li> You must roll an exact number to leave the board </li>
                <li> You cannot move a piece onto a square already occupied by one of your own pieces </li>
                <li> If you land on a piece occupied by another opponent, the opposing piece is sent back to the start </li>
            </ul>
        </div>
    );
}

function getPage3(closeRules) {
    return (
        <div className={pageStyles.rulesWindow}>
            <button className={pageStyles.exit} onClick={closeRules}> X </button>
            <ul className={pageStyles.pageText}>
                <li> The red squares on the board are special squares called Rosetta squares </li>
                <li> If you land on a Rosetta you re-roll and move again (the same piece or another) </li>
                <li> When a piece is on a Rosetta square, it cannot be taken by an opponent's piece </li>
            </ul>
        </div>
    );
}

function getPage4(closeRules) {
    return (
        <div className={pageStyles.rulesWindow}>
            <button className={pageStyles.exit} onClick={closeRules}> X </button>
            <ul className={pageStyles.pageText}>
                <li> Once you are ready to play, clicking the green ready button above allows you to be challenged by other users </li>
                <li> Once a user is ready to challenge, the challenge button next to their name will light up </li>
                <li> This button can then be clicked to start a game with that user </li>
            </ul>
        </div>
    );
}
