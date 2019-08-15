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
import { requestAsync, updateEntities } from 'redux-query';
import jwtDecode from 'jwt-decode'

import { Box, Grommet } from 'grommet';
//import Grommet from 'grommet/components/Grommet';
//import Box from 'grommet/components/Box';
import NavSidebar from '../presentational/NavSidebar'

import { actions, getTitle, getRoutes, getNavActive } from '../../reducers/app'
import { actions as serviceActions } from '../../reducers/service'


const mapStateToProps = (state /*, props*/) => {
    return {
        //title: getTitle(state),
        //routes: getRoutes(state),
        navActive: getNavActive(state),
        authError: state.entities.error
    }
}

const mapDispatchToProps = (dispatch) => ({
    ...bindActionCreators(actions, dispatch),
    ...bindActionCreators(serviceActions, dispatch),
    dispatch
});

class Manager extends Component {

    _login = (credentials) => {
        const { dispatch } = this.props;

        dispatch(requestAsync({
            url: '../rest/auth/arcgis/authorize2',
            body: JSON.stringify(credentials),
            options: {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            },
            update: {
                token: (prev, next) => { const user = next && jwtDecode(next); return user && user.role != 'USER' && next },
                error: (prev, next) => { return next ? "Invalid credentials" : 'Not authorized' }
            }
        }));
    }

    _logout = () => {
        const { clearToken, dispatch } = this.props;
        console.log('LOGOUT', this.props);
        dispatch(updateEntities({
            token: () => null,
            error: () => null
        }))
    }

    componentDidMount() {
        const { applicationName, title } = this.props;

        document.title = `${applicationName} ${title}`;
    }

    render() {
        const { navToggle, navActive, urlLevels, applicationName, logo, routes, theme, user, authError, children } = this.props;


        return (
            <Grommet full theme={theme}>
                {user
                    ? <Box direction="row" fill>
                        <NavSidebar user={user} onLogout={this._logout} isActive={navActive} isLayer={urlLevels > 1} title={applicationName} logo={logo} routes={routes} onClose={navToggle.bind(null, false)} />
                        <Box flex fill="vertical">{children}</Box>
                    </Box>
                    : <Box direction="row" fill>
                        <NavSidebar login={true} onLogin={this._login} loginError={authError} isActive={navActive} isLayer={urlLevels > 1} title={applicationName} logo={logo} routes={routes} onClose={navToggle.bind(null, false)} />
                        <Box flex fill="vertical"></Box>
                    </Box>
                }
            </Grommet>
        );
    }
}
;

const ConnectedManager = connect(mapStateToProps, mapDispatchToProps)(Manager)

export default ConnectedManager;
