/*
 * Copyright 2018 interactive instruments GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import { routerForHash, initializeCurrentLocation, replace } from 'redux-little-router';
import { routesToLittleRouter } from './util'

import { reducer as uiReducer } from 'redux-ui'
import { entitiesReducer, queriesReducer, queryMiddleware } from 'redux-query';


import * as reducers from './reducers'


export default function (routes, data) {
    //console.log(routesToLittleRouter(routes));
    const { reducer: routerReducer, middleware: routerMiddleware, enhancer: routerEnhancer } = routerForHash({
        routes: routesToLittleRouter(routes),
        //basename: '/manager'
    })

    const combine = (reds) => combineReducers({
        ...reds,
        router: routerReducer,
        ui: uiReducer,
        entities: entitiesReducer,
        queries: queriesReducer,
    })

    const reducer = combine(reducers)

    const queriesMiddleware = queryMiddleware((state) => state.queries, (state) => state.entities)
    const middleware = [routerMiddleware, queriesMiddleware];

    // Be sure to ONLY add this middleware in development!
    //if (process.env.NODE_ENV !== 'production')
    //middleware.unshift(require('redux-immutable-state-invariant').default())


    var store = createStore(
        reducer,
        data,
        composeWithDevTools(
            routerEnhancer,
            applyMiddleware(...middleware),
            // other store enhancers if any
        )
    );

    if (module && module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./reducers', () => {
            const nextReducer = require('./reducers');
            store.replaceReducer(combine(nextReducer));
        });
    }

    //sagaMiddleware.run(rootSaga);

    const initialLocation = store.getState().router;
    if (initialLocation) {
        store.dispatch(initializeCurrentLocation(initialLocation));
        if (initialLocation.pathname === routes.path && routes.index) {
            store.dispatch(replace(routes.index));
        }
    }

    return store
}
