/*
 * Copyright 2018 interactive instruments GmbH
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
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PasswordInput from 'grommet/components/PasswordInput';

import { handleInputChange } from '../../util'


export default class PasswordInputUi extends Component {

    _handleInputChange = (event) => {
        const {onChange, onDebounce, onValidate, readOnly} = this.props;

        if (!readOnly)
            handleInputChange(event, onChange, onDebounce, onValidate);
    }

    render() {
        const {name, value, onChange, onDebounce, onValidate, readOnly, ...attributes} = this.props;

        return (
            <PasswordInput {...attributes}
                name={ name }
                value={ value }
                onChange={ this._handleInputChange } />
        );
    }
}

PasswordInputUi.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onDebounce: PropTypes.func,
    onValidate: PropTypes.func
};

PasswordInputUi.defaultProps = {
};