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

import { Box, Text, Heading, Meter } from 'grommet';
import StatusIcon from '../common/StatusIcon';
import Spinning from '../common/Spinning';
import Tile from '../common/Tile'
import ServiceTask from './ServiceTask'

export default class ServiceTile extends PureComponent {

  render() {
    const { id, label, status, shouldStart, hasBackgroundTask, message, progress, changeLocation, selected, compact, small } = this.props;

    if (process.env.NODE_ENV !== 'production') {
      console.log('MSG', message, progress, hasBackgroundTask)
    }
    const isInitializing = status === 'INITIALIZING';
    const isOnline = 'STARTED' === status;
    const isDisabled = !isOnline && shouldStart;

    const iconSize = compact ? "list" : "medium"
    let status1 = hasBackgroundTask ? <ServiceTask progress={progress} message={message} /> : null; // item.status === 'INITIALIZING' ? 'Initializing' : (item.status === 'STARTED' ? 'Online' : 'Offline');
    let icon1 = ''; // item.status === 'INITIALIZING' ? <Spinning size="medium" style={ { verticalAlign: 'middle', marginRight: '6px' } } /> : <StatusIcon value={ item.status === 'STARTED' ? 'ok' : 'critical' } size="medium" />
    let status2 = isInitializing ? 'Initializing' : isOnline ? 'Published' : isDisabled ? 'Defective' : 'Offline';
    let icon2 = isInitializing
      ? <Spinning size={iconSize} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
      : <StatusIcon value={isOnline ? 'ok' : isDisabled ? 'critical' : 'disabled'}
        size={iconSize}
        a11yTitle={status2}
        title={status2} />

    return (
      <Tile align="start"
        direction="column"
        basis={compact || small ? 'auto' : '1/3'}
        fill={compact || small ? 'horizontal' : false}
        onClick={() => changeLocation({ pathname: `/services/${id}` }, { persistQuery: true })}
        selected={selected}
        background="content"
        hoverStyle="border"
        hoverColorIndex="accent-1"
        hoverBorderSize="large">
        {/*Card*/}
        <Box fill="horizontal"
          textSize="small">
          <Box direction="row" justify="between" align="center" fill="horizontal">
            <Text size={compact ? 'xsmall' : 'small'} weight='bold' color='light-6' truncate={true} title={id} margin={{ right: "xsmall" }} style={{ fontFamily: '"Roboto Mono", monospace' }}>
              {id}
            </Text>
            <span title={status2}>{icon2}</span>
          </Box>
          {!compact
            ? <Box
              margin={{ top: "small" }}
              direction="row"
              align="center"
              justify="between"
              textSize="small"
            >
              <Heading level="4" truncate={true} margin="none" title={label}>
                {label}
              </Heading>
            </Box>
            : <Box
              margin={{ top: "none" }}
              direction="row"
              align="center"
              justify="between"
            >
              <Heading level="6" truncate={true} margin="none" title={label}>
                {label}
              </Heading>
            </Box>}
          {!compact && <Box direction="row" justify="between" align="center">
            {hasBackgroundTask ? <span><span style={{ verticalAlign: 'middle' }}>{status1}</span></span> : ''}
          </Box>}

        </Box>
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
