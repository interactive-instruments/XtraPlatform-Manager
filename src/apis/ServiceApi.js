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

    getServicesQuery: function (reload) {
        return {
            url: `${API_URL}`,
            transform: (services) => normalizeServices(services).entities,
            update: {
                services: (prev, next) => next
            },
            force: reload === true
        }
    },

    getServiceQuery: function (id, reload) {
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

    getServiceConfigQuery: function (id, reload) {
        return {
            url: `${API_URL}${id}/`,
            transform: (serviceConfig) => normalizeServiceConfigs([serviceConfig]).entities,
            update: {
                serviceConfigs: (prev, next) => next,
                featureTypes: (prev, next) => next,
                mappings: (prev, next) => next
            },
            force: reload === true
        }
    },

    addServiceQuery: function (service) {
        return {
            url: `${API_URL}`,
            body: JSON.stringify(service),
            options: {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            },
            transform: (service) => normalizeServices([service]).entities,
            update: {
                services: (prev, next) => {
                    return {
                        ...prev,
                        ...next
                    }
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
            }/*,
            rollback: {
                services: (initialValue, currentValue) => {
                    const { [service.id]: deletedItem, ...rest } = currentValue
                    return rest;
                }
            }*/
        }
    },

    updateServiceQuery: function (serviceId, update) {
        return {
            url: `${API_URL}${serviceId}/`,
            body: JSON.stringify(update),
            options: {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            },
            optimisticUpdate: {
                services: (prev) => Object.assign({}, prev, {
                    [serviceId]: {
                        ...prev[serviceId],
                        ...update,
                        status: update.shouldStart === true ? 'STARTED' : update.shouldStart === false ? 'STOPPED' : prev[serviceId].status,
                        dateModified: Date.now()
                    }
                }),
                serviceConfigs: (prev) => Object.assign({}, prev, {
                    [serviceId]: {
                        ...prev[serviceId],
                        ...update,
                        dateModified: Date.now()
                    }
                })
            }
        }
    },

    deleteServiceQuery: function (service) {
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
                //serviceIds: (prev) => prev.filter(id => id !== service.id)
            }
        }
    }
}

export default ServiceApi;
