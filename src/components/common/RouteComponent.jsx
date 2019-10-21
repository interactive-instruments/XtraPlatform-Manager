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
import PropTypes from 'prop-types';

export default class RouteComponent extends Component {

    _cleanRoutes = (routes = []) => {
        return routes.map(route => {
            const { component, components, ...rest } = route;
            return rest;
        })
    }

    _getComponentProps = () => {
        const { typedComponents, route, children, ...rest } = this.props;

        return {
            ...rest,
            title: route.title,
            routes: this._cleanRoutes(route.routes)
        }
    }

    render() {
        const { urlQuery: { type }, serviceType, typedComponents, route, children } = this.props;

        let componentProps = {}
        let RouteComp = 'div'

        if (route.component) {
            RouteComp = route.component
            componentProps = this._getComponentProps()
        } else if (route.typedComponent && typedComponents[route.typedComponent]) {
            if (typedComponents[route.typedComponent][serviceType]) {
                RouteComp = typedComponents[route.typedComponent][serviceType]
                componentProps = this._getComponentProps()
            } else if (typedComponents[route.typedComponent][type]) {
                RouteComp = typedComponents[route.typedComponent][type]
                componentProps = this._getComponentProps()
            }
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log('RC', componentProps, route)
        }

        return (
            <RouteComp {...componentProps}>
                {children}
            </RouteComp>
        )
    }
}
