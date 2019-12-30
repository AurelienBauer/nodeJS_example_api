/* login to known Apis */
import httpStatus from 'http-status';
import request from 'request-promise';
import { LocalStorage } from 'node-localstorage';
import moment from 'moment-timezone';
import { apis } from '../configs/apis';
import ErrorApi from '../services/ErrorApi.service';
import ApiRefreshToken from '../models/apiRefreshToken.model';
import { logger } from '../services/logger.service';

async function _useRefreshToken(apiInfo, localStorage) {
  try {
    const refreshToken = await ApiRefreshToken.findOne({ apiName: apiInfo.name });
    const body = await request.post({
      url: `${apiInfo.url }/auth/refreshToken`,
      json: true,
      method: 'POST',
      body: {
        refreshToken: refreshToken.token,
      },
      rejectUnauthorized: false, // Authorized unofficial SSL certificate
      requestCert: true,
    });

    if (!body.tokens) { return false; }

    localStorage.setItem(apiInfo.name, JSON.stringify(body.tokens.accessToken));
    return body.tokens.accessToken;
  } catch (err) {
    if (err.error) {
      logger.warn(err.error);
    } else logger.warn(err);
    return false;
  }
}

async function _getTokenFromLocalStorage(apiInfo, localStorage) {
  const token = JSON.parse(localStorage.getItem(apiInfo.name));

  if (!token || Date.parse(moment().toDate()) > Date.parse(token.expiresIn)) {
    return _useRefreshToken(apiInfo, localStorage);
  }

  return token;
}

async function _requireNewToken(apiInfo, localStorage) {
  try {
    const body = await request.post({
      url: `${apiInfo.url }/auth/login`,
      json: true,
      method: 'POST',
      body: {
        apiName: apiInfo.name,
        apiId: apiInfo.clientId,
        password: apiInfo.password,
      },
      rejectUnauthorized: false, // Authorized unofficial SSL certificate
      requestCert: true,
    });

    localStorage.setItem(apiInfo.name, JSON.stringify(body.tokens.accessToken));
    return body.tokens;
  } catch (err) {
    if (err.error) {
      throw new ErrorApi({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: `Error from another known api named ${apiInfo.name}`,
        errors: err.error,
      });
    } else throw err;
  }
}

const connect = async (req, res, next, which) => {
  const apiInfo = apis[which];
  const localStorage = new LocalStorage('./lcStorage');

  if (!apiInfo) {
    return next(new ErrorApi({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'Try to connect to an unkown api.',
    }));
  }

  try {
    const localeApis = (req.login && req.login.apis) ? req.login.apis : [];
    let accessToken = await _getTokenFromLocalStorage(apiInfo, localStorage);

    if (!accessToken) {
      const tokens = await _requireNewToken(apiInfo, localStorage);
      ApiRefreshToken.insertRefreshTokenIfNeeded(apiInfo.name, tokens.refreshToken);
      accessToken = tokens.accessToken.token;
    }

    localeApis.push({
      name: apiInfo.name,
      url: apiInfo.url,
      token: accessToken.token,
    });
    req.login = { apis: localeApis };
    return next();
  } catch (err) {
    return next(err);
  }
};

const connectToApi = (which) => async (req, res, next) => connect(req, res, next, which);

export default connectToApi;
