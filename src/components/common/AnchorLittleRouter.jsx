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

// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Children, Component } from 'react';
import { connect } from 'react-redux'

import { Link } from 'redux-little-router';
import { Anchor, Box, Text } from 'grommet';
import styled from "styled-components";

const StyledBox = styled(Box)`
    background-color: ${props => props.isActive ? props.theme.menu.active.color : 'transparent'};

    &:hover {
        background-color: ${props => { console.log('THB', props); return props.theme.menu.active.color }};
    }
`;

const NoPadding = styled(Box)`
    & a {
        padding: 0px;
        ${props =>
        props.iconSize &&
        `height: ${props.theme.icon.size[props.iconSize]};`}
    }
`;

@connect(
    (state, props) => {
        return {
            isActive: props.path && state.router.pathname && state.router.pathname.indexOf(props.path) === 0
        }
    },
    (dispatch) => {
        return {
        }
    })

export default class AnchorLittleRouter extends Component {

    render() {
        const { path, menu, icon, label, isActive, pad, margin, ...rest } = this.props;

        if (menu) {
            return (
                <StyledBox isActive={isActive} pad={pad} margin={margin} >
                    <Anchor {...rest}
                        href={path}
                        label={<Text weight='normal' size='medium' color='light-1'>{label}</Text>}
                        icon={icon}
                        as={Link} />
                </StyledBox>
            )
        }

        if (icon) {
            const iconSize = (icon && icon.props.size) || 'medium';

            if (!path) {
                return (
                    <NoPadding iconSize={iconSize}>
                        <Anchor {...rest}
                            icon={icon}
                            label={label} />
                    </NoPadding>
                );
            }

            return (
                <NoPadding iconSize={iconSize}>
                    <Anchor {...rest}
                        icon={icon}
                        label={label}
                        href={path}
                        as={Link} />
                </NoPadding>
            );
        }



        return (
            <Anchor {...rest}
                label={label}
                href={path}
                as={Link} />
        );
    }
}
;
