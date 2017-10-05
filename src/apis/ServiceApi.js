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

import { normalizeServices, normalizeServiceConfigs } from './ServiceNormalizer'

const ServiceApi = {

    getServicesQuery: function() {
        return {
            url: `/rest/admin/services/`,
            transform: (serviceIds) => ({
                serviceIds: serviceIds
            }),
            update: {
                serviceIds: (prev, next) => next
            }
        // TODO: force: true
        }
    },

    getServiceQuery: function(id) {
        return {
            url: `/rest/admin/services/${id}/`,
            transform: (service) => normalizeServices([service]).entities,
            update: {
                services: (prev, next) => {
                    return {
                        ...prev,
                        ...next
                    }
                }
            },
        //force: true
        }
    },

    getServiceConfigQuery: function(id) {
        return {
            url: `/rest/admin/services/${id}/config/`,
            transform: (serviceConfig) => normalizeServiceConfigs([serviceConfig]).entities,
            update: {
                serviceConfigs: (prev, next) => next,
                featureTypes: (prev, next) => next,
                mappings: (prev, next) => next
            },
            force: true
        }
    },

    addServiceQuery: function(service) {
        return {
            url: `/rest/admin/services/`,
            body: JSON.stringify(service),
            options: {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            },
            optimisticUpdate: {
                services: (prev) => Object.assign({}, prev, {
                    [service.id]: {
                        ...service,
                        name: service.id,
                        status: 'INITIALIZING',
                        dateCreated: Date.now()
                    }
                })
            },
            rollback: {
                services: (initialValue, currentValue) => {
                    const {[service.id]: deletedItem, ...rest} = currentValue
                    return rest;
                }
            }
        }
    },

    updateServiceQuery: function(service) {
        return {
            url: `/rest/admin/services/${service.id}/`,
            body: JSON.stringify(service),
            options: {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            },
            optimisticUpdate: {
                services: (prev) => Object.assign({}, prev, {
                    [service.id]: {
                        ...prev[service.id],
                        ...service,
                        dateModified: Date.now()
                    }
                }),
                serviceConfigs: (prev) => Object.assign({}, prev, {
                    [service.id]: {
                        ...prev[service.id],
                        ...service,
                        dateModified: Date.now()
                    }
                })
            }
        }
    },

    deleteServiceQuery: function(service) {
        return {
            url: `/rest/admin/services/${service.id}/`,
            options: {
                method: 'DELETE'
            },
            optimisticUpdate: {
                services: (prev) => {
                    const next = Object.assign({}, prev);
                    delete next[service.id];
                    return next
                },
                serviceIds: (prev) => prev.filter(id => id !== service.id)
            }
        }
    }
}

export default ServiceApi;