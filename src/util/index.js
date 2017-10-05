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

let _timers = {}

export const handleInputChange = (event, onChange, onDebounce, timeout = 1000) => {
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

        if (onDebounce) {
            _timers[field] = setTimeout(() => {
                onDebounce(field, value)
            }, timeout);
        }
    }
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