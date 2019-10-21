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

import React, { useState } from 'react';

import { Box, Anchor, Paragraph } from 'grommet'
import { MapLocation, Power as PowerIcon, Trash as TrashIcon, FolderOpen } from 'grommet-icons'
import styled from 'styled-components'

import LayerForm from '../common/LayerForm';
import ServiceApi from '../../apis/ServiceApi'

const Power = styled(Box)`
    & a {
        &:hover {
            & svg {
                stroke: ${props => props.theme.global.colors[props.hoverColor]};
            }
        }
    }
`

const ServiceActions = props => {

    const [layerOpened, setLayerOpened] = useState(false);

    const _onLayerOpen = () => {
        setLayerOpened(true);
    }

    const _onLayerClose = () => {
        setLayerOpened(false);
    }

    const _onPower = (start) => {
        const { updateService } = props;

        updateService({
            shouldStart: start
        });
    }

    const _onRemove = () => {
        const { id, removeService } = props;

        removeService({
            id: id
        });
    }

    const { id, status, shouldStart, secured, token, ViewActions } = props;
    const isOnline = 'STARTED' === status;
    const isDisabled = !isOnline && shouldStart;
    const parameters = secured ? `?token=${token}` : ''

    return (
        <Box flex={false}>
            <Box direction="row" justify='end'>
                <Power hoverColor={isOnline ? 'status-critical' : isDisabled ? 'status-critical' : 'status-ok'}>
                    <Anchor
                        icon={<PowerIcon />}
                        title={`${isOnline ? 'Hide' : isDisabled ? 'Defective' : 'Publish'}`}
                        color={isOnline ? 'status-ok' : isDisabled ? 'status-critical' : 'status-disabled'}
                        onClick={() => _onPower(!isOnline)}
                        disabled={isDisabled} />
                </Power>
                <ViewActions id={id} isOnline={isOnline} parameters={parameters} />
                <Anchor
                    icon={<TrashIcon />}
                    title="Remove"
                    onClick={_onLayerOpen} />
            </Box>
            {layerOpened && <LayerForm title="Remove"
                submitLabel="Yes, remove"
                compact={true}
                onClose={_onLayerClose}
                onSubmit={_onRemove}>
                <Paragraph>
                    Are you sure you want to remove the service with id <strong>{id}</strong>?
                            </Paragraph>
            </LayerForm>}
        </Box>
    );
}

ServiceActions.displayName = 'ServiceActions'

export default ServiceActions
