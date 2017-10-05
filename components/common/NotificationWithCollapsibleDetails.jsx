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

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Collapsible from 'grommet/components/Collapsible';
import Notification from 'grommet/components/Notification';
import Paragraph from 'grommet/components/Paragraph';
import Button from 'grommet/components/Button';
import Anchor from 'grommet/components/Anchor';
import CaretNextIcon from 'grommet/components/icons/base/CaretNext';
import CaretDownIcon from 'grommet/components/icons/base/CaretDown';


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
        const {message, details, ...rest} = this.props;
        const {detailsOpen} = this.state;

        const dtls = details && <Collapsible active={ detailsOpen } margin="none">
                                    { Object.values(details).map((dtl, i) => <Paragraph key={ i } size="medium" margin="none">
                                                                                 { i > 0 && <br/> }
                                                                                 { dtl }
                                                                             </Paragraph>) }
                                </Collapsible>

        const Toggle = detailsOpen ? CaretDownIcon : CaretNextIcon

        const msg = <span style={ { verticalAlign: 'top' } }>{ message }<Anchor icon={ <Toggle size="small" /> }
                                                                                title={ `Show more` }
                                                                                a11yTitle={ `Show more` }
                                                                                onClick={ this._toggle } /></span>

        return (
            <Notification {...rest} message={ msg } className="notification-details">
                { dtls }
            </Notification>
        );
    }
}

export default NotificationWithCollapsibleDetails