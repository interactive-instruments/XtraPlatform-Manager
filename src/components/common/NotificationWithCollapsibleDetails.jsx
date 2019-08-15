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

import { Collapsible, Text, Anchor } from 'grommet';
import Notification from './Notification';
import { CaretNext as CaretNextIcon, CaretDown as CaretDownIcon } from 'grommet-icons';

//TODO
import './NotificationWithCollapsibleDetails.scss';

class NotificationWithCollapsibleDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            detailsOpen: props.open || false,
        }
    }

    _toggle = () => {

        this.setState({
            detailsOpen: !this.state.detailsOpen
        });
    }

    render() {
        const { message, details, ...rest } = this.props;
        const { detailsOpen } = this.state;
        console.log('DETA', details)
        const dtls = details && <Collapsible open={detailsOpen}>
            {details.map((dtl, i) => <Text key={i} size="medium" margin="none">
                {i > 0 && <br />}
                {dtl}
            </Text>)}
        </Collapsible>

        const Toggle = detailsOpen ? CaretDownIcon : CaretNextIcon

        const msg = <span style={{ verticalAlign: 'top' }}>{message}<Anchor icon={<Toggle size="small" />}
            title={`Show more`}
            a11yTitle={`Show more`}
            onClick={this._toggle} /></span>

        return (
            <Notification {...rest} message={msg} className="notification-details">
                {dtls}
            </Notification>
        );
    }
}

export default NotificationWithCollapsibleDetails
