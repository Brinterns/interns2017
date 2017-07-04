import React from 'react';
import { shallow } from 'enzyme';

import Lobby from './Lobby';

describe('<Lobby />', () => {
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run']);
    });

});
