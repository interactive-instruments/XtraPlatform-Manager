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

import { normalize, schema } from 'normalizr';

var commonProps = ['id']; // code

var ftProps = commonProps.concat(['name', 'namespace', 'displayName', 'mappings', 'temporalExtent']);

var serviceProps = commonProps.concat(['type', 'name', 'description', 'status', 'featureTypes', 'serviceProperties', 'dateCreated', 'wfsAdapter']);

function filter(include, exclude, entity, parent) {
    var idFound = false
    var mapFound = false
    var wfsFound = false
    for (var key in entity) {
        if (include.indexOf(key) === -1) {
            delete entity[key];
            continue;
        }
        if ((!include || include.length === 0) && exclude.indexOf(key) !== -1) {
            delete entity[key];
            continue;
        }

        if (key === 'id')
            idFound = true
        if (key === 'mappings')
            mapFound = true
        if (key === 'wfsAdapter')
            wfsFound = true
    }
    if (!idFound && entity.namespace && entity.name) {
        entity.id = parent.id + '_' + entity.namespace + ':' + entity.name
        entity.qn = entity.namespace + ':' + entity.name
    }
    if (mapFound) {
        entity.mappings = entity.mappings.mappings
        for (var key in entity.mappings) {
            entity.mappings[key].id = entity.id;
            if (key !== entity.qn)
                entity.mappings[key].id += '_' + key;
            entity.mappings[key].qn = key;
        }
    }
    if (wfsFound) {
        entity.nameSpaces = {}
        for (var key in entity.wfsAdapter.nsStore.namespaces) {
            var newKey = entity.wfsAdapter.nsStore.namespaces[key];
            entity.nameSpaces[newKey] = key;
        }
    //delete entity['wfsAdapter'];
    }
    return entity;
}


const mappingSchema = new schema.Entity('mappings', {}, {
    //idAttribute: (value, parent, key) => parent.id + '_' + value.id
    //processStrategy: filter.bind(null, [], [])
});

const ftSchema = new schema.Entity('featureTypes', {
    mappings: new schema.Array(mappingSchema)
}, {
    //idAttribute: (value, parent, key) => parent.id + '_' + value.id,
    processStrategy: filter.bind(null, ftProps, [])
});

const serviceConfigSchema = new schema.Entity('serviceConfigs', {
    featureTypes: new schema.Array(ftSchema)
}, {
    processStrategy: filter.bind(null, serviceProps, [])
});

const serviceConfigListSchema = new schema.Array(serviceConfigSchema);

const serviceSchema = new schema.Entity('services', {
    featureTypes: new schema.Array(ftSchema)
}, {
    processStrategy: filter.bind(null, serviceProps, [])
});

const serviceListSchema = new schema.Array(serviceSchema);

export default function normalize2(services) {
    return normalize(services, serviceListSchema);
}

export const normalizeServices = function(services) {
    return normalize(services, serviceListSchema);
}

export const normalizeServiceConfigs = function(services) {
    return normalize(services, serviceConfigListSchema);
}

