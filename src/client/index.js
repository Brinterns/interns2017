import React from 'react';
import { Router, browserHistory } from 'react-router';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';

import config from './config/config';
import configureStore from './store';
import App from './app';
import routes from './routes';

const store = configureStore();
const app = document.getElementById('app');


cloak.run(config.cloakAddress);

render(
    <AppContainer>
        <Provider store={store}>
            <Router history={browserHistory} routes={routes} />
        </Provider>
    </AppContainer>,
    app
);

if(module.hot) {
    module.hot.accept('./app', () => {
        const NextApp = require('./app').default;
        render(
            <AppContainer>
                <Provider store={store}>
                    <NextApp />
                </Provider>
            </AppContainer>,
            app
        );
    });
}
