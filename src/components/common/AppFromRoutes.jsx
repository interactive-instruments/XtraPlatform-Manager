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

import React, { Component } from 'react';
import { Fragment } from 'redux-little-router';

import RouteComponent from './RouteComponent'

export default class AppFromRoutes extends Component {

    _renderRoute = (route, prefix = '') => {
        const {urlParams, urlQuery, applicationName, serviceTypes, typeLabels, serviceMenu, typedComponents} = this.props;

        const componentProps = {
            urlParams,
            urlQuery,
            applicationName,
            serviceTypes,
            typedComponents,
            typeLabels,
            serviceMenu,
            route,
            getTypedComponent: (name, type) => typedComponents[name] ? typedComponents[name][type] : null
        }

        const path = `${prefix === '/' ? '' : prefix}${route.path}`
        //console.log(path)
        return <Fragment key={ path } forRoute={ route.path } forNoMatch={ route.forNoMatch }>
                   { <RouteComponent {...componentProps}>
                         { route.routes && this._renderRoutes(route.routes, path) }
                     </RouteComponent> }
               </Fragment>
    }

    _renderRoutes = (routes, prefix = '') => {
        return routes.map((route) => this._renderRoute(route, prefix))
    }

    render() {
        const {routes} = this.props;

        return this._renderRoute(routes);
    }
}
