import React from 'react';
import { Box } from 'grommet';

export default props => {
  const { pad, ...rest } = props;
  return (
    <Box fill='horizontal' flex={false} pad={pad || { horizontal: "small" }}>
      <Box
        direction="row"
        fill='horizontal'
        height='xsmall'
        gap='small'
        justify='between'
        align='center'
        alignContent='center'
        flex={false}
        {...rest} />
    </Box>
  )
};
