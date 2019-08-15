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

// (C) Copyright 2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Layer, Box, Form, Heading, Button } from 'grommet';

import Header from './Header';
//import BusyIcon from 'grommet/components/icons/Spinning';

export default class LayerForm extends Component {

    _onSubmit = (event) => {
        event.preventDefault();
        this.props.onSubmit();
    }

    render() {
        const { submitLabel, onClose, title, compact, busy, secondaryControl, titleTag } = this.props;
        let control;
        if (busy) {
            const label = (true === busy ? '' : busy);
            control = (
                <Box direction="row" align="center" pad={{ horizontal: 'medium', between: 'small' }}>
                    {/*<BusyIcon /><span className="secondary">{ label }</span>*/}busy...
                </Box>
            );
        } else {
            control = (
                <Button type="submit"
                    primary={true}
                    label={submitLabel}
                    onClick={this._onSubmit} />
            );
        }

        const cancel = (
            <Button
                label='Cancel'
                color='status-critical'
                onClick={onClose} />
        );

        return (
            <Layer position="right"
                full='vertical'
                closer={true}
                onEsc={onClose}
                onClickOutside={onClose}>
                <Box pad='medium'>
                    <Form onSubmit={this._onSubmit}>
                        <Header pad={{ horizontal: 'none' }}>
                            <Heading level='3' margin='none'>
                                {title}
                            </Heading>
                        </Header>
                        <Box>
                            {this.props.children}
                        </Box>
                        <Box as='footer' direction='row' pad={{ vertical: 'medium' }} gap='medium' justify="end">
                            {secondaryControl || cancel}
                            {control}
                        </Box>
                    </Form>
                </Box>
            </Layer>
        );
    }
}
;

LayerForm.propTypes = {
    busy: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    compact: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    secondaryControl: PropTypes.node,
    submitLabel: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    titleTag: PropTypes.string
};

LayerForm.defaultProps = {
    titleTag: 'h1'
};
