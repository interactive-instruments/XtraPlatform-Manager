/*
 * Copyright 2018 interactive instruments GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { normalizeServices, normalizeServiceConfigs } from './ServiceNormalizer'

const API_URL = '../rest/admin/services/';
const VIEW_URL = '../rest/services/';

const ServiceApi = {

    URL: API_URL,
    VIEW_URL: VIEW_URL,

    getServicesQuery: function() {
        return {
            url: `${API_URL}`,
            transform: (serviceIds) => ({
                serviceIds: serviceIds
            }),
            update: {
                serviceIds: (prev, next) => next
            }
        // TODO: force: true
        }
    },

    getServiceQuery: function(id, reload) {
        return {
            url: `${API_URL}${id}/`,
            transform: (service) => normalizeServices([service]).entities,
            update: {
                services: (prev, next) => {
                    return {
                        ...prev,
                        ...next
                    }
                }
            },
            force: reload === true
        }
    },

    getServiceConfigQuery: function(id) {
        return {
            url: `${API_URL}${id}/config/`,
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
            url: `${API_URL}`,
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
                        createdAt: Date.now()
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
            url: `${API_URL}${service.id}/`,
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
            url: `${API_URL}${service.id}/`,
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