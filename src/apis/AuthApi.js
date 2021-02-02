/*
 * Copyright 2018 interactive instruments GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import jwtDecode from "jwt-decode";
import { getCookieValue, deleteCookie } from "../util";

const TOKEN_URL = "../rest/auth/token";
const TOKEN_COOKIE_NAME = "xtraplatform-token";

export const secureQuery = (queryConfig) => {
  const origTransform = queryConfig.transform;
  const origUpdate = queryConfig.update || {};

  queryConfig.transform = (source) => {
    const entities = origTransform ? origTransform(source) : {};

    try {
      const user = jwtDecode(getCookieValue(TOKEN_COOKIE_NAME));
      entities.token = user && user.role && user.role !== "USER" ? user : null;
      entities.expired = false;
      //console.log('GOOD', user)
    } catch (error) {
      entities.token = null;
      entities.expired = true;
      //console.log('EXPIRED', error)
      //TODO: push
      location.hash = "/services";
    }

    //console.log('ENT', entities)
    return entities;
  };

  queryConfig.update = {
    ...origUpdate,
    token: (prev, next) => next,
    expired: (prev, next) => next,
  };

  return queryConfig;
};

export const getTokenQuery = (credentials) => ({
  url: TOKEN_URL,
  body: JSON.stringify(credentials),
  options: {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  },
  transform: (response) => {
    try {
      const user = jwtDecode(getCookieValue(TOKEN_COOKIE_NAME));
      //console.log('AUTH', user)
      if (user && user.role && user.role !== "USER") {
        return {
          token: user,
          error: null,
          expired: false,
        };
      }
    } catch (e) {
      //console.log('NO AUTH', response)
    }

    return {
      token: null,
      error: response && response.error ? response.error : "Not authorized",
      expired: false,
    };
  },
  update: {
    token: (prev, next) => next,
    error: (prev, next) => next,
    expired: (prev, next) => next,
  },
  force: true,
});

export const clearToken = () => {
  deleteCookie(TOKEN_COOKIE_NAME);

  return {
    token: () => null,
    error: () => null,
  };
};

export const checkAuth = () => {
  try {
    return jwtDecode(getCookieValue(TOKEN_COOKIE_NAME));
  } catch (error) {
    //ignore
  }

  return null;
};
