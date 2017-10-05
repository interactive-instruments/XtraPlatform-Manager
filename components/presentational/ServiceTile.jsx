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

import Tile from 'grommet/components/Tile';
import Card from 'grommet/components/Card';
import Heading from 'grommet/components/Heading';
import Label from 'grommet/components/Label';
import StatusIcon from 'grommet/components/icons/Status';
import Spinning from 'grommet/components/icons/Spinning';
import { Link } from 'redux-little-router';

export default class ServiceTile extends Component {

    render() {
        const {item, changeLocation, selected} = this.props;

        let status = item.status === 'INITIALIZING' ? 'Initializing' : (item.status === 'STARTED' ? 'Online' : 'Offline');
        let icon = item.status === 'INITIALIZING' ? <Spinning size="medium" style={ { verticalAlign: 'middle', marginRight: '6px' } } /> : <StatusIcon value={ item.status === 'STARTED' ? 'ok' : 'critical' } size="medium" />
        return (
            <Tile align="start"
                pad="small"
                direction="column"
                size="large"
                onClick={ () => changeLocation(`/services/${item.id}`) }
                selected={ selected }
                a11yTitle={ `View ${item.name} Virtual Machine` }
                colorIndex="light-1"
                separator="all"
                hoverStyle="border"
                hoverColorIndex="accent-1"
                hoverBorderSize="large">
                <Card heading={ <Heading tag="h3" strong={ true }>
                                    { item.name }
                                </Heading> }
                    textSize="small"
                    label={ <Label size='small' uppercase={ true } margin='small'>
                                { item.id }
                            </Label> }
                    description={ <span>{ icon } <span style={ { verticalAlign: 'middle' } }>{ status }</span></span> } />
            </Tile>
        );
    }
}

ServiceTile.propTypes = {
    item: PropTypes.object.isRequired,
    changeLocation: PropTypes.func,
    selected: PropTypes.bool
};

ServiceTile.defaultProps = {
};
