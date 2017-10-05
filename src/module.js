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

import Manager from './components/container/Manager'
import Services from './components/container/Services'
import ServiceIndex from './components/container/ServiceIndex'
import ServiceShow from './components/container/ServiceShow'
import ServiceAdd from './components/container/ServiceAdd'

import { render as renderApp } from './components/common/AppLittleRouter'
import createStore from './create-store'

// TODO: wrap config editing components under ServiceEdit 

export const app = {
    applicationName: 'XtraPlatform',
    serviceTypes: [ /*'base'*/ ],
    routes: {
        path: '/',
        component: Manager,
        title: 'Manager',
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
                    },
                    {
                        path: '/',
                        component: ServiceIndex
                    }
                ]
            }
        ]
    },
    typedComponents: {
        /*ServiceAdd: {
            base: ServiceAdd
        },
        ServiceShow: {
            base: ServiceShow
        }*/
    },
    serviceMenu: [],
    mapStateToProps: state => ({
        urlParams: state.router.params,
        urlQuery: state.router.query,
    //serviceType: state.router.params && state.router.params.id && state.entities.services && state.entities.services[state.router.params.id] && state.entities.services[state.router.params.id].type // || 'base'
    }),
    createStore: createStore
};

let store
let cfg

const initialData = {
    entities: {
        services: {
        }
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