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
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query';
import ServiceApi from '../../apis/ServiceApi'

@connect(
    (state, props) => {
        return {
            services: state.entities.services, //getServices(state),
            serviceIds: state.entities.serviceIds,
            serviceType: state.router.params && state.router.params.id && state.entities.services && state.entities.services[state.router.params.id] && state.entities.services[state.router.params.id].type // || 'base'
        }
    }
)

@connectRequest(
    (props) => {
        if (!props.serviceIds) {
            return ServiceApi.getServicesQuery()
        }
        return props.serviceIds.map(id => ServiceApi.getServiceQuery(id))
    })

export default class Services extends Component {

    render() {
        const {services, serviceIds, serviceType, children, ...rest} = this.props;

        const componentProps = {
            services,
            serviceIds,
            serviceType
        }

        const childrenWithProps = React.Children.map(children,
            (child) => React.cloneElement(child, {}, React.cloneElement(React.Children.only(child.props.children), componentProps))
        );

        return <div>
                   { childrenWithProps }
               </div>
    }
}

Services.propTypes = {
    //children: PropTypes.element.isRequired
};

Services.defaultProps = {
};