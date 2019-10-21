/*
 * Copyright 2018 interactive instruments GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { normalizeServices, normalizeServiceConfigs } from './ServiceNormalizer'
import { secureQuery } from './AuthApi'

const API_URL = '../rest/admin/services/';
const VIEW_URL = '../rest/services/';

export const DEFAULT_OPTIONS = {
    forceReload: false,
    secured: true,
}

const ServiceApi = {

    URL: API_URL,
    VIEW_URL: VIEW_URL,

    getServicesQuery: (options = DEFAULT_OPTIONS) => {
        const query = {
            url: `${API_URL}`,
            transform: (services) => normalizeServices(services).entities,
            update: {
                services: (prev, next) => next
            },
            force: options.forceReload === true
        }

        return options.secured ? secureQuery(query) : query
    },

    getServiceQuery: (id, options = DEFAULT_OPTIONS) => {
        const query = {
            url: `${API_URL}${id}/`,
            transform: (serviceConfig) => normalizeServiceConfigs([serviceConfig]).entities,
            update: {
                serviceConfigs: (prev, next) => next,
                featureTypes: (prev, next) => next,
                mappings: (prev, next) => next
            },
            force: options.forceReload === true
        }

        return options.secured ? secureQuery(query) : query
    },

    addServiceQuery: (service, options = DEFAULT_OPTIONS) => {
        const query = {
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

        return options.secured ? secureQuery(query) : query
    },

    updateServiceQuery: (serviceId, update, options = DEFAULT_OPTIONS) => {
        const query = {
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
                        lastModified: Date.now()
                    }
                }),
                serviceConfigs: (prev) => Object.assign({}, prev, {
                    [serviceId]: {
                        ...prev[serviceId],
                        ...update,
                        lastModified: Date.now()
                    }
                })
            }
        }

        return options.secured ? secureQuery(query) : query
    },

    deleteServiceQuery: (service, options = DEFAULT_OPTIONS) => {
        const query = {
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

        return options.secured ? secureQuery(query) : query
    }
}

export default ServiceApi;
