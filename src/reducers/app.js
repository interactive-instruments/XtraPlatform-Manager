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

import { createAction, handleActions } from 'redux-actions';
//import { normalize, Schema, arrayOf } from 'normalizr';
//import { createSelector } from 'reselect'
//import { actions as reportActions } from './reporter'

// action creators
export const actions = {
    changeTitle: createAction('app/title'),
    navToggle: createAction('nav/toggle')
};


// state
const initialState = {
    title: 'XtraPlatform Manager',
    routes: [
        {
            path: '/services',
            label: 'Services',
            component: './Services'
        } /*,
        {
            path: '/about',
            label: 'About',
            component: 'About'
        }*/
    ],
    navActive: true
}

// reducer
export default handleActions({
    [actions.changeTitle]: changeTitle,
    [actions.navToggle]: navToggle
}, initialState);

function changeTitle(state, action) {
    return {
        ...state,
        title: action.payload
    }
}

function navToggle(state, action) {
    return {
        ...state,
        navActive: action.payload
    }
}



//selectors
export const getTitle = (state) => state.app.title
export const getRoutes = (state) => state.app.routes
export const getNavActive = (state) => state.app.navActive