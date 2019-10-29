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
import { requestAsync, updateEntities, mutateAsync } from 'redux-query';

import { Box, Grommet } from 'grommet';
import NavSidebar from '../presentational/NavSidebar'

import { actions, getTitle, getRoutes, getNavActive } from '../../reducers/app'
import { actions as serviceActions } from '../../reducers/service'
import { getTokenQuery, clearToken } from '../../apis/AuthApi'
import UserApi from '../../apis/UserApi'
import { push } from 'redux-little-router';


const mapStateToProps = (state /*, props*/) => {
    return {
        //title: getTitle(state),
        //routes: getRoutes(state),
        navActive: getNavActive(state),
        authError: state.entities.error,
        authExpired: state.entities.expired
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

        dispatch(requestAsync(getTokenQuery(credentials)))
    }

    _logout = () => {
        const { dispatch } = this.props;

        dispatch(updateEntities(clearToken()))
        dispatch(push('/services'))
    }

    _changePassword = (update) => {
        const { dispatch, secured } = this.props;

        dispatch(mutateAsync(UserApi.changePasswordQuery(update.user, update)))
        /*.then((result) => {
            if (result.status === 200 || result.status === 204) {
                dispatch(requestAsync(UserApi.getUsersQuery({ forceReload: true, secured: secured })));
            }
        })*/
    }

    componentWillMount() {
        const { secured, user, urlLevels, navToggle } = this.props;

        if (!secured) {
            this._login({ rememberMe: true })
        } else if (!user && urlLevels > 1) {
            navToggle(true);
        }
    }

    componentDidMount() {
        const { applicationName, title } = this.props;

        document.title = `${applicationName} ${title}`;
    }

    render() {
        const { navToggle, navActive, urlLevels, applicationName, logo, routes, theme, user, authExpired, secured, authError, children } = this.props;


        return (
            <Grommet full theme={theme}>
                {user
                    ? <Box direction="row" fill>
                        <NavSidebar secured={secured} user={user} onLogout={this._logout} isActive={navActive} isLayer={urlLevels > 1} title={applicationName} logo={logo} routes={routes} onChangePassword={this._changePassword} onClose={navToggle.bind(null, false)} />
                        <Box flex fill="vertical">{user.forceChangePassword || children}</Box>
                    </Box>
                    : <Box direction="row" fill>
                        <NavSidebar secured={secured} login={true} onLogin={this._login} loginError={authError} loginExpired={authExpired} isActive={navActive} isLayer={urlLevels > 1} title={applicationName} logo={logo} routes={routes} onChangePassword={this._changePassword} onClose={navToggle.bind(null, false)} />
                        <Box flex fill="vertical">{/*children*/}</Box>
                    </Box>
                }
            </Grommet>
        );
    }
}
;

const ConnectedManager = connect(mapStateToProps, mapDispatchToProps)(Manager)

export default ConnectedManager;
