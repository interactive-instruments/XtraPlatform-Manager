/*
 * Copyright 2018 interactive instruments GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
//import { normalizeServices, normalizeServiceConfigs } from './ServiceNormalizer'
import { normalize, schema } from "normalizr";
import { secureQuery } from "./AuthApi";
import { DEFAULT_OPTIONS } from "./ServiceApi";

const API_URL = "../rest/admin/users/";

const userSchema = new schema.Entity(
  "users",
  {},
  {
    idAttribute: "id",
  }
);

export default {
  getUsersQuery: function (options = DEFAULT_OPTIONS) {
    const query = {
      url: `${API_URL}`,
      transform: (userIds) => ({
        userIds: userIds,
      }),
      update: {
        userIds: (prev, next) => next,
      },
      force: options.forceReload,
    };

    return options.secured ? secureQuery(query) : query;
  },

  getUserQuery: function (id, options = DEFAULT_OPTIONS) {
    const query = {
      url: `${API_URL}${encodeURIComponent(id)}/`,
      transform: (user) => normalize(user, userSchema).entities,
      update: {
        users: (prev, next) => {
          return {
            ...prev,
            ...next,
          };
        },
      },
      //force: options.forceReload
    };

    return options.secured ? secureQuery(query) : query;
  },

  addUserQuery: function (user, options = DEFAULT_OPTIONS) {
    const query = {
      url: `${API_URL}`,
      body: JSON.stringify(user),
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      transform: (user) => normalize(user, userSchema).entities,
      update: {
        users: (prev, next) => {
          return {
            ...prev,
            ...next,
          };
        },
      },
    };

    return options.secured ? secureQuery(query) : query;
  },

  changePasswordQuery: function (id, update, options = DEFAULT_OPTIONS) {
    const query = {
      url: `${API_URL}${encodeURIComponent(id)}`,
      body: JSON.stringify(update),
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      transform: (user) => normalize(user, userSchema).entities,
      update: {
        users: (prev, next) => {
          return {
            ...prev,
            ...next,
          };
        },
      },
    };

    return options.secured ? secureQuery(query) : query;
  },

  deleteUserQuery: function (id, options = DEFAULT_OPTIONS) {
    const query = {
      url: `${API_URL}${encodeURIComponent(id)}`,
      options: {
        method: "DELETE",
      },
      update: {
        userIds: (prev, next) => {
          return prev.filter((el) => el !== id);
        },
        users: (prev, next) => {
          const { [id]: deletedItem, ...rest } = prev;
          return rest;
        },
      },
    };

    return options.secured ? secureQuery(query) : query;
  },
};
