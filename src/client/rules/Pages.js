import React, { Component } from 'react';
import pageStyles from './Rules.css';

export function getPage(i) {
    var page = null;
    switch(i) {
        case 0:
            page = getPage0();
            break;
    }
    return(page);
}

function getPage0() {
    return (

    );
}
