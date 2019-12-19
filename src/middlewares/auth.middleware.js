import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import ErrorApi from '../services/ErrorApi.service';
import UserModel from '../models/user.model';

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
      const user = await UserModel.getUserByEmail(decoded.email);
      req.user = user;
      return next();
    });
  }
  return next(new ErrorApi({
    status: httpStatus.UNAUTHORIZED,
    message: 'Auth token is not supplied',
  }));
};

// eslint-disable-next-line import/prefer-default-export
export { checkToken };
