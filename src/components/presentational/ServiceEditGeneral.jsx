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
import ui from 'redux-ui';
import { resolve } from "uri-js";

import { Box, Form, FormField, TextInput } from 'grommet'

import TextInputUi from '../common/TextInputUi';
import ServiceApi from '../../apis/ServiceApi';


@ui({
    state: {
        label: (props) => props.label
    }
})
export default class ServiceEditGeneral extends Component {

    _save = () => {
        const { ui, onChange } = this.props;

        onChange(ui);
    }

    render() {
        const { id, label, ui, updateUI } = this.props;

        return (
            <Box pad={{ horizontal: 'small', vertical: 'medium' }} fill="horizontal">
                <Form>
                    <FormField label="Id">
                        <TextInput name="id" value={id} readOnly={true} />
                    </FormField>
                    <FormField label="Url">
                        <TextInput name="url" value={`${resolve(window.location.href, ServiceApi.VIEW_URL)}${id}`} readOnly={true} />
                    </FormField>
                    <FormField label="Display name">
                        <TextInputUi name="label"
                            value={ui.label}
                            onChange={updateUI}
                            onDebounce={this._save} />
                    </FormField>
                </Form>
                {/*<ServiceEditExtensions service={service} onChange={this.props.onChange}/>
                        <ServiceEditTiles service={service} onChange={this.props.onChange}/>*/}
            </Box>
        );
    }
}

ServiceEditGeneral.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};

ServiceEditGeneral.defaultProps = {
};
