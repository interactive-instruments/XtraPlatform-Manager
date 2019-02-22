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

import Section from 'grommet/components/Section';
import Form from 'grommet/components/Form';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';
import Accordion from 'grommet/components/Accordion';
import AccordionPanel from 'grommet/components/AccordionPanel';

import CheckboxUi from 'xtraplatform-manager/src/components/common/CheckboxUi';


@ui({
    state: {
        managerEnabled: (props) => props.styles.managerEnabled,
        mapsEnabled: (props) => props.styles.mapsEnabled
    }
})

export default class ServiceEditStyles extends Component {

    _save = () => {
        const { otherCapabilities, ui, onChange } = this.props;
        onChange({
            capabilities: otherCapabilities
                .concat({
                    extensionType: "STYLES",
                    enabled: true,
                    managerEnabled: ui.managerEnabled,
                    mapsEnabled: ui.mapsEnabled
                })
                .sort((a, b) => a.extensionType < b.extensionType ? -1 : a.extensionType === b.extensionType ? 0 : 1)
        });

    }

    render() {
        const { ui, updateUI } = this.props;

        return (
            <Section pad={{ vertical: 'medium' }} full="horizontal">
                <Form compact={false} pad={{ horizontal: 'medium', vertical: 'small' }}>
                    <FormField>
                        <CheckboxUi name='managerEnabled'
                            label="enable styles manager"
                            checked={ui.managerEnabled}
                            onChange={updateUI}
                            onDebounce={this._save} />

                        <CheckboxUi name='mapsEnabled'
                            label="enable maps "
                            checked={ui.mapsEnabled}
                            onChange={updateUI}
                            onDebounce={this._save} />
                    </FormField>
                </Form>
            </Section>
        );
    }
}

ServiceEditStyles.propTypes = {
    onChange: PropTypes.func.isRequired
};

ServiceEditStyles.defaultProps = {
};
