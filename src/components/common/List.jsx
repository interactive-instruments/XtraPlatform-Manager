import React from 'react';

import { Box } from 'grommet';
import styled from "styled-components";

const StyledBox = styled(Box)`
background-color: ${props => props.selected ? props.theme.global.colors.active : props.background};
color: ${props => props.selected ? props.theme.global.colors.text.dark : props.theme.global.colors.text.light};
cursor:  ${props => props.onClick ? 'pointer' : 'default'};

&:hover {
        background-color: ${props => props.theme.global.colors.active};
        color: ${props => props.theme.global.colors.text.dark};
    }
`;

export const List = props => <Box fill tag='ul' border={{ side: 'top', color: 'light-4' }} {...props} />;

export const ListItem = props => {
    const Li = props.hover ? StyledBox : Box;
    return (
        <Li
            tag='li'
            border={{ side: 'bottom', color: 'light-4' }}
            pad='small'
            direction='row'
            justify='between'
            flex={false}
            {...props}
        />
    )
};
