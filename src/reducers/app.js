/*
 * Copyright 2018 interactive instruments GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
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