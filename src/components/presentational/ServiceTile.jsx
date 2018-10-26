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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Tile from 'grommet/components/Tile';
import Card from 'grommet/components/Card';
import Heading from 'grommet/components/Heading';
import Label from 'grommet/components/Label';
import StatusIcon from 'grommet/components/icons/Status';
import Spinning from 'grommet/components/icons/Spinning';
import Meter from 'grommet/components/Meter';
import Value from 'grommet/components/Value';
import Box from 'grommet/components/Box';
import { Link } from 'redux-little-router';

export default class ServiceTile extends PureComponent {

    render() {
        const {id, label, status, hasBackgroundTask, message, progress, changeLocation, selected} = this.props;

        let status1 = <Meter type='bar'
                          label={ message }
                          size='large'
                          value={ progress } />; // item.status === 'INITIALIZING' ? 'Initializing' : (item.status === 'STARTED' ? 'Online' : 'Offline');
        let icon1 = ''; // item.status === 'INITIALIZING' ? <Spinning size="medium" style={ { verticalAlign: 'middle', marginRight: '6px' } } /> : <StatusIcon value={ item.status === 'STARTED' ? 'ok' : 'critical' } size="medium" />
        let status2 = status === 'INITIALIZING' ? 'Initializing' : (status === 'STARTED' ? 'Online' : 'Offline');
        let icon2 = status === 'INITIALIZING' ? <Spinning size="medium" style={ { verticalAlign: 'middle', marginRight: '6px' } } /> : <StatusIcon value={ status === 'STARTED' ? 'ok' : 'critical' }
                                                                                                                                           size="medium"
                                                                                                                                           a11yTitle={ status2 }
                                                                                                                                           title={ status2 } />
        return (
            <Tile align="start"
                pad="none"
                direction="column"
                size="large"
                onClick={ () => changeLocation(`/services/${id}`) }
                selected={ selected }
                colorIndex="light-1"
                separator="all"
                hoverStyle="border"
                hoverColorIndex="accent-1"
                hoverBorderSize="large">
                <Card full="horizontal"
                    heading={ <Heading tag="h3" strong={ true }>
                                  { label }
                              </Heading> }
                    textSize="small"
                    label={ <Box direction="row" justify="between" align="center">
                                <Label size='small' uppercase={ true } margin='small'>
                                    { id }
                                </Label><span title={ status2 }>{ icon2 }</span>
                            </Box> }
                    description={ hasBackgroundTask ? <span>{ icon1 } <span style={ { verticalAlign: 'middle' } }>{ status1 }</span></span> : '' } />
            </Tile>
        );
    }
}

ServiceTile.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    hasBackgroundTask: PropTypes.bool.isRequired,
    message: PropTypes.string,
    progress: PropTypes.number,
    changeLocation: PropTypes.func,
    selected: PropTypes.bool
};

ServiceTile.defaultProps = {
};
