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
import { Animate } from "react-show";

import RouteComponent from './RouteComponent'

export default class AppFromRoutes extends Component {

    _renderRoute = (route, prefix = '') => {
        const { urlParams, urlQuery, urlLevels, user, secured, applicationName, logo, serviceTypes, typeLabels, serviceMenu, typedComponents, extendableComponents, theme } = this.props;

        const componentProps = {
            urlParams,
            urlQuery,
            urlLevels,
            user,
            secured,
            applicationName,
            logo,
            serviceTypes,
            typedComponents,
            typeLabels,
            serviceMenu,
            route,
            theme,
            getTypedComponent: (name, type) => typedComponents[name] ? typedComponents[name][type] : null,
            getExtendableComponents: (name) => extendableComponents[name]
        }

        const path = `${prefix === '/' ? '' : prefix}${route.path}`
        //console.log(path)

        const wrapper = (show, child) => {
            if (process.env.NODE_ENV !== 'production') {
                console.log(show ? 'show ' : 'hide ', child.props.route.path);
            }
            return <Animate
                show={show} // Toggle true or false to show or hide the content!
                duration={500}
                enter={{
                    width: "auto"
                }}
                start={{
                    width: 10 // The starting style for the component.
                    // If the 'leave' prop isn't defined, 'start' is reused!
                }}
            >
                {child}
            </Animate>
        }

        return <Fragment key={path} forRoute={route.path} forNoMatch={route.forNoMatch}>
            {/*TODO: SwitchWithSlide into RouteComponent */}
            {<RouteComponent {...componentProps}>
                {route.routes && this._renderRoutes(route.routes, path, user)}
            </RouteComponent>}
        </Fragment>
    }

    _renderRoutes = (routes, prefix = '', user = null) => {
        return routes
            .filter(route => !route.roles || (user && route.roles.some(role => role === user.role)))
            .map((route) => this._renderRoute(route, prefix))
    }

    render() {
        const { routes } = this.props;

        return this._renderRoute(routes);
    }
}
