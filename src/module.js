/*
 * Copyright 2018 interactive instruments GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import Manager from './components/container/Manager'
import Services from './components/container/Services'
import ServiceIndex from './components/container/ServiceIndex'
import ServiceShow from './components/container/Service'
import ServiceAdd from './components/container/ServiceAdd'
import NotFound from './components/presentational/NotFound'
import Settings from './components/container/Settings'


import { render as renderApp } from './components/common/AppLittleRouter'
import createStore from './create-store'
import { customTheme } from './theme'
import ServiceEditGeneral from './components/presentational/ServiceEditGeneral';
import ServiceEditExtensions from './components/presentational/ServiceEditExtensions';
import ServiceEditTiles from './components/presentational/ServiceEditTiles';

// TODO: wrap config editing components under ServiceEdit 

export const app = {
    applicationName: 'XtraPlatform',
    serviceTypes: ['base'],
    routes: {
        path: '/',
        component: Manager,
        title: 'Manager',
        index: '/services',
        routes: [
            {
                path: '/services',
                component: Services,
                title: 'Services',
                menu: true,
                routes: [
                    {
                        path: '/addcatalog'
                    },
                    {
                        path: '/add',
                        typedComponent: 'ServiceAdd'
                    },
                    {
                        path: '/:id/:ftid'
                    },
                    {
                        path: '/:id',
                        typedComponent: 'ServiceShow'
                    }/*,
                    {
                        path: '/',
                        component: ServiceIndex
                    }*/
                ]
            },
            {},
            {
                path: '/settings',
                component: Settings,
                title: 'Settings',
                menu: true,
                roles: ['SUPERADMIN', 'ADMIN']
            },
            {
                path: '/404',
                forNoMatch: true,
                component: NotFound
            }
        ]
    },
    typedComponents: {
        ServiceAdd: {
            base: ServiceAdd
        },
        ServiceShow: {
            WFS3: ServiceShow
        }
    },
    extendableComponents: {
        ServiceEdit: {
            General: ServiceEditGeneral,
            Api: ServiceEditExtensions,
            Tiles: ServiceEditTiles
        }
    },
    serviceMenu: [],
    mapStateToProps: state => ({
        urlParams: state.router.params,
        urlQuery: state.router.query,
        //serviceType: state.router.params && state.router.params.id && state.entities.services && state.entities.services[state.router.params.id] && state.entities.services[state.router.params.id].type // || 'base'
    }),
    createStore: createStore,
    theme: customTheme
};

let store
let cfg

const initialData = {
    entities: {
        services: {
        },
    }
}

export const render = (mdl) => {
    cfg = mdl
    store = mdl.createStore(mdl.routes, initialData);

    renderApp(store, mdl);
};

// Hot Module Replacement API
if (module && module.hot) {
    module.hot.accept('./module.js', () => {
        renderApp(store, cfg);
    });
}
