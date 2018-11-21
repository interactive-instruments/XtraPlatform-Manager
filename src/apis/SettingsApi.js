/*
 * Copyright 2018 interactive instruments GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */




const SettingsApi = {


    getSettingsQuery: function(){
        return{
            url: `/rest/admin/settings/`,
            transform: (settingIds) => ({
                settingIds: settingIds
            }),
            update: {
                settingIds: (prev, next) => next
            },
            force: true
        }
    },

    getSettingQuery: function(id){
        return{
            url: `/rest/admin/settings/${encodeURIComponent(id)}/`,
            transform: (setting) => ({
                setting: {[id]: setting}
            }),
            update: {
                setting: (prev, next) => {
                    return {
                        ...prev,
                        ...next
                    }
                }
            },
        }
    },

    updateSettingQuery: function(id,setting) {
        return {
            url: `rest/admin/settings/${encodeURIComponent(id)}/`,
            body: JSON.stringify(setting),
            options: {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            },
            update: {
                setting: (prev) => Object.assign({}, prev, {
                    [id]: {
                        ...prev[id],
                        ...setting,
                        dateModified: Date.now()
                    }
                }),
            },
        }
    },
}

export default SettingsApi;