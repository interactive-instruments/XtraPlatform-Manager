/*
 * Copyright 2017 interactive instruments GmbH
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

import CheckBox from 'grommet/components/CheckBox';

import { handleInputChange } from '../../util'


export default class CheckBoxUi extends Component {

    _handleInputChange = (event) => {
        const { onChange, onDebounce } = this.props;

        handleInputChange(event, onChange, onDebounce);
    }

    render() {
        const { name, checked, smaller, onChange, onDebounce, className, ...attributes } = this.props;

        return (
            <CheckBox name={name}
                checked={checked}
                onChange={this._handleInputChange}
                className={{ 'xtraplatform-checkbox-ui': true, 'xtraplatform-full': true, 'xtraplatform-smaller': smaller, ...className }}
                {...attributes} />
        );
    }
}

CheckBoxUi.propTypes = {
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    smaller: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onDebounce: PropTypes.func
};

CheckBoxUi.defaultProps = {
    smaller: false
};
