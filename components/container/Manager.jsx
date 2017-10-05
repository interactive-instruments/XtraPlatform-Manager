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

// TODO: does not work, importing in index.html for now
//import styles
//import 'grommet/scss/vanilla/index';
//import '../../scss/default/index';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import App from 'grommet/components/App';
import Split from 'grommet/components/Split';
import NavSidebar from '../presentational/NavSidebar'

import { actions, getTitle, getRoutes, getNavActive } from '../../reducers/app'


const mapStateToProps = (state /*, props*/ ) => {
    return {
        //title: getTitle(state),
        //routes: getRoutes(state),
        navActive: getNavActive(state)
    }
}

const mapDispatchToProps = (dispatch) => ({
    ...bindActionCreators(actions, dispatch)
});

class Manager extends Component {

    componentDidMount() {
        const {applicationName, title} = this.props;

        document.title = `${applicationName} ${title}`;
    }

    render() {
        const {navToggle, navActive, applicationName, routes, children} = this.props;


        let nav;
        if (navActive) {
            nav = <NavSidebar title={ applicationName } routes={ routes } onClose={ navToggle.bind(null, false) } />;
        }

        return (
            <App centered={ false }>
                <Split flex="right">
                    { nav }
                    { children }
                </Split>
            </App>
        );
    }
}
;

const ConnectedManager = connect(mapStateToProps, mapDispatchToProps)(Manager)

export default ConnectedManager;
