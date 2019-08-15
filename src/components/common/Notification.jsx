import React from 'react';
import { Box, Meter, Text, Button } from 'grommet';
import { Close } from 'grommet-icons';
import StatusIcon from './StatusIcon';

export default ({ message, percentComplete, state, status, onClose, children, ...rest }) => (
  <Box
    direction='row'
    align='center'
    background={status ? `status-${status.toLowerCase()}` : undefined}
    fill="horizontal"
    justify="between"
    {...rest}
  >
    <Box
      direction='row'
      align='center'
      fill="horizontal">
      {status ? (
        <Box margin={{ right: 'medium' }}>
          <StatusIcon value={status} color='white' />
        </Box>
      ) : null}
      <Box fill="horizontal">
        {message ? <Text>{message}</Text> : null}
        {children}
      </Box>
      {percentComplete ? (
        <Box direction='row' align='center'>
          <Meter values={[{ value: percentComplete }]} />
          <Text>{percentComplete}%</Text>
        </Box>
      ) : null}
    </Box>
    {onClose !== undefined && <Button icon={<Close size="medium" />} onClick={onClose} />}
  </Box>
);
