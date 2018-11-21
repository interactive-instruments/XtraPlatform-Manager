/*
 * Copyright 2018 interactive instruments GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
let _timers = {}

//TODO add support for arrays in select fields, at the Moment only Objects
export const handleInputChange = (event, onChange, onDebounce, onValidate, timeout = 1000) => {
    if (event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : (event.option ? event.option.value : target.value);
        const field = target.name;

        if (onDebounce) {
            clearTimeout(_timers[field]);
        }

        if (onChange) {
            onChange(field, value);
        }

        if (onValidate) {
            onValidate(field, value);
        }

        if (onDebounce) {
            _timers[field] = setTimeout(() => {
                onDebounce(field, value)
            }, timeout);
        }
    }
}

export const shallowDiffers = (a, b, allowSubset = false, ignore = []) => {
    if (a === b) return false
    if (!allowSubset)
        for (let i in a)
            if (!(i in b)) return true
    for (let i in b)
        if (!ignore.includes(i) && a[i] !== b[i]) return true
    return false
}

export const routesToLittleRouter = (route, routes = {}) => {
    const path = route.parent ? route.path.substr(route.parent.length) : route.path
    return {
        [path]: {
            ...routes[path],
            ..._renderRoutes(route.routes)
        }
    }
}

const _renderRoutes = (routes) => {
    const r = {}

    if (routes) {
        return routes.reduce((r1, r2) => {
            return r2.parent
                ? {
                    ...r1,
                    [r2.parent]: {
                        ...r1[r2.parent],
                        ...routesToLittleRouter(r2, r1)
                    }
                }
                : {
                    ...r1,
                    ...routesToLittleRouter(r2, r1)
                }
        }, r)
    }

    return r
}