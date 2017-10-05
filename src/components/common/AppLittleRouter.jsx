/*
 * Copyright 2017 European Union
 * Licensed under the EUPL, Version 1.2 or - as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 * https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 * This work was supported by the EU Interoperability Solutions for
 * European Public Administrations Programme (https://ec.europa.eu/isa2)
 * through the ELISE action (European Location Interoperability Solutions 
 * for e-Government).
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux'
import { AppContainer } from 'react-hot-loader';
//import { RouterProvider } from 'redux-little-router';

import App from './AppFromRoutes'


let config;
let store;

export const render = (appStore, appConfig) => {
    config = appConfig;
    store = appStore;

    _render(App, store, config);
}

const _render = (Component, store, props) => {
    const Connected = connect((state => ({
        urlParams: state.router.params,
        urlQuery: state.router.query
    })))(Component)

    ReactDOM.render(
        <AppContainer>
            <Provider store={ store }>
                <Connected { ...props } />
            </Provider>
        </AppContainer>,
        document.getElementById('app-wrapper')
    );
};





// Hot Module Replacement API
/*if (module && module.hot) {
    module.hot.accept('./App', () => {
        _render(App, store, config)
    });
}*/

