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

import LayerForm from '../common/LayerForm';
import ServiceApi from '../../apis/ServiceApi'


export default props => {

    const [layerOpened, setLayerOpened] = useState(false);

    const _onLayerOpen = () => {
        setLayerOpened(true);
    }

    const _onLayerClose = () => {
        setLayerOpened(false);
    }

    const _onPower = (start) => {
        const { service, updateService } = props;

        updateService({
            id: service.id,
            shouldStart: start
        });
    }

    const _onRemove = () => {
        const { service, removeService } = props;

        removeService({
            id: service.id
        });
    }

    const { service, token } = props;
    const isOnline = 'STARTED' === service.status;
    const parameters = service.secured ? `?token=${token}` : ''

    return (
        <Box>
            <Box direction="row" justify='end'>
                <Anchor
                    icon={<PowerIcon />}
                    title={`${isOnline ? 'Hide' : 'Publish'}`}
                    color={isOnline ? 'status-ok' : 'status-critical'}
                    onClick={() => _onPower(!isOnline)} />
                <Anchor
                    icon={<MapLocation />}
                    title="View"
                    href={`${ServiceApi.VIEW_URL}${service.id}/maps/default${parameters}`}
                    target="_blank" />
                <Anchor
                    icon={<FolderOpen />}
                    title="Browse"
                    href={`${ServiceApi.VIEW_URL}${service.id}/${parameters}`}
                    target="_blank" />
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
                    Are you sure you want to remove the service with id <strong>{service.id}</strong>?
                            </Paragraph>
            </LayerForm>}
        </Box>
    );
}
