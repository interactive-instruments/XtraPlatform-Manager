import React from 'react';
import { Box } from 'grommet';

export default ({ children, compact, ...rest }) => {
  let tiles = children;
  return (
    <Box
      direction={compact ? 'column' : 'row'}
      wrap={!compact}
      justify='start'
      alignContent='start'
      pad={{ vertical: 'xsmall', horizontal: compact ? 'small' : 'xsmall' }}
      flex='grow'
      basis='auto'
      {...rest}
    >
      {tiles}
    </Box>
  );
};
