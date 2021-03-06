import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import moment from 'moment-timezone';
import ErrorApi from '../services/ErrorApi.service';
import RefreshToken from '../models/refreshToken.model';
import { getTokenInformation } from '../services/auth.service';

const checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers.authorization;

  if (token) {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    return jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return next(new ErrorApi({
          status: httpStatus.UNAUTHORIZED,
          message: 'Token is not valid',
        }));
      }
      const info = await getTokenInformation(decoded);
      req[info.type] = info.body;
      return next();
    });
  }
  return next(new ErrorApi({
    status: httpStatus.UNAUTHORIZED,
    message: 'Auth token is not supplied',
  }));
};

const checkRefreshToken = async (req, res, next) => {
  let token = req.body.refreshToken;

  if (token) {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    const refreshToken = await RefreshToken.findOne({ token });
    if (!refreshToken) {
      return next(new ErrorApi({
        status: httpStatus.UNAUTHORIZED,
        message: 'RefreshToken is not valid',
      }));
    }

    if (Date.parse(moment().toDate()) > Date.parse(refreshToken.expiresIn)) {
      return next(new ErrorApi({
        status: httpStatus.UNAUTHORIZED,
        message: 'refreshToken expired',
      }));
    }

    const decoded = jwt.decode(refreshToken.token);
    const info = await getTokenInformation(decoded);
    req[info.type] = info.body;
    return next();
  }

  return next(new ErrorApi({
    status: httpStatus.UNAUTHORIZED,
    message: 'Auth token is not supplied.',
  }));
};

export { checkToken, checkRefreshToken };
