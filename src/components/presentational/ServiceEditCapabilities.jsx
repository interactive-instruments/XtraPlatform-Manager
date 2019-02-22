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
import ui from 'redux-ui';


import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';
import FormField from 'grommet/components/FormField';

import CheckboxUi from 'xtraplatform-manager/src/components/common/CheckboxUi';


@ui({
    state: {
        //service: (props) => props.service,
        capabilities: (props) => props.capabilities
    }
})

export default class ServiceEditCapabilities extends Component {

    _save = () => {
        const { ui, onChange } = this.props;

        onChange(ui);
    }

    render() {
        const { ui, updateUI } = this.props;

        return (
            ui.capabilities &&
            <FormField label="Capabilities">
                {ui.capabilities.map(ext => <CheckboxUi
                    key={ext.extensionType}
                    className={{ "xtraplatform-flex": true }}
                    name="enabled"
                    label={ext.extensionType}
                    checked={ext.enabled}
                    toggle={true}
                    reverse={true}
                    smaller={true}
                    onChange={(field, value) => updateUI("capabilities",
                        ui.capabilities.filter(ext2 => ext2.extensionType !== ext.extensionType)
                            .concat({ ...ext, [field]: value })
                            .sort((a, b) => a.extensionType < b.extensionType ? -1 : a.extensionType === b.extensionType ? 0 : 1))}
                    onDebounce={this._save} />)}
            </FormField>
        );
    }
}
