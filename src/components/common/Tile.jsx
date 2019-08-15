import React from 'react';
import { Button, Box } from 'grommet';
import styled from "styled-components";


const StyledBox = styled(Box)`
${props => props.selected && `border-color: ${props.theme.global.colors.active};`}

&:hover {
        border-color: ${props => props.theme.global.colors.active};
    }
`;

export default ({ onClick, basis, background, fill, pad, ...rest }) => {
  if (onClick) {
    return (
      <Box fill={fill} basis={basis} flex="grow" margin={{ horizontal: 'xsmall', vertical: 'xsmall' }}>
        <Button plain={true} onClick={onClick}>
          <StyledBox pad={pad || 'small'} border={{ side: 'all', color: 'light-4', size: 'small' }} background={background} {...rest} />
        </Button>
      </Box>
    );
  }
  return (
    <Box basis={basis} {...rest} />
  );
};
