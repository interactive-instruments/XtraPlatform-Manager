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
import { connect } from 'react-redux'
import { push } from 'redux-little-router'
import { mutateAsync, requestAsync } from 'redux-query';
import ui from 'redux-ui';

import { Box, Text, Button, Form, FormField } from 'grommet';
import Header from '../common/Header';
import { ChapterAdd } from 'grommet-icons';

import ServiceApi from '../../apis/ServiceApi'
import { actions } from '../../reducers/service'
import TextInputUi from '../common/TextInputUi';
import Anchor from '../common/AnchorLittleRouter';
import uiValidator, { minLength, maxLength, allowedChars } from '../common/ui-validator';
import { withAppConfig } from 'xtraplatform-manager/src/app-context'


@ui({
    state: {
        id: ''
    }
})

@uiValidator({
    id: [minLength(3), maxLength(32), allowedChars('A-Za-z0-9-_')]
})

@withAppConfig()

@connect(
    (state, props) => {
        return {}
    },
    (dispatch, props) => {
        return {
            addService: (service) => {
                dispatch(mutateAsync(ServiceApi.addServiceQuery(service, { secured: props.appConfig.secured })))
                    .then((result) => {
                        if (result.status === 200) {

                        } else {
                            const error = result.body && result.body.error || {}
                            dispatch(actions.addFailed({
                                ...service,
                                ...error,
                                text: 'Failed to add service with id "' + service.id + '"',
                                status: 'critical'
                            }))
                        }
                    })

                dispatch(push('/services'))
            }
        }
    })

export default class ServiceAdd extends Component {

    _addService = (event) => {
        event.preventDefault();
        const { ui, addService } = this.props;

        addService({
            ...ui,
            /*featureProvider: {
                providerType: 'WFS',
                connectionInfo: {
                    uri: ui.url,
                    user: ui.user,
                    password: ui.password,
                    //TODO: defaults
                    method: 'GET',
                    version: '2.0.0',
                    gmlVersion: '3.2.1'
                },
                nativeCrs: {
                    code: 4326
                }
            }*/
        });
    }

    render() {
        const { ui, validator, updateUI, addService, children } = this.props;

        return (
            <Box fill={true}>
                <Header justify='start' border={{ side: 'bottom', size: 'small', color: 'light-4' }}
                    size="large">
                    <ChapterAdd />
                    <Text size='large' weight={500}>New Service</Text>
                </Header>
                <Box pad={{ horizontal: 'small', vertical: 'medium' }} fill={true} overflow={{ vertical: 'auto' }}>
                    <Box fill="horizontal" flex="grow">
                        <FormField label="ID"
                            help="The URL suffix for the new service"
                            error={validator.messages.id}
                            style={{ width: '100%' }}>
                            <TextInputUi name="id"
                                autoFocus
                                value={ui.id}
                                onChange={updateUI} />
                        </FormField>
                        {children}
                        <Box pad={{ "vertical": "medium" }}>
                            <Button label='Add' primary={true} onClick={validator.valid ? this._addService : null} />
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }
}
