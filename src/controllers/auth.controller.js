import httpStatus from 'http-status';
import ErrorApi from '../services/ErrorApi.service';
import RefreshToken from '../models/refreshToken.model';
import { generateAccessToken } from '../services/auth.service';

exports.login = async (req, res, next) => {
  try {
    const isAuthenticated = true; /* TODO: replace by your authentication system */
    if (!isAuthenticated) {
      return next(new ErrorApi({
        status: httpStatus.UNAUTHORIZED,
        message: 'Authentication Failure',
      }));
    }

    const accessToken = generateAccessToken('useremail@shoul_be_unique.com');

    const refreshToken = await RefreshToken.generateAndInsertRefreshToken({ email: 'useremail@shoul_be_unique.com' });
    if (refreshToken instanceof ErrorApi) {
      return next(refreshToken);
    }

    return res.status(httpStatus.OK)
      .json({
        token: {
          accessToken,
          refreshToken,
        },
        message: 'Authentication successful!',
        success: true,
      });
  } catch (err) {
    return next(err);
  }
};

exports.refreshToken = (req, res, next) => {
  try {
    const accessToken = generateAccessToken('useremail@shoul_be_unique.com');
    return res.status(httpStatus.OK)
      .json({
        token: {
          accessToken,
        },
        message: 'Regenerate accessToken successfully!',
        success: true,
      });
  } catch (err) {
    return next(err);
  }
};

exports.status = (req, res, next) => {
  try {
    res.status(httpStatus.OK)
      .json({
        authUser: req.user,
        status: 'authenticated',
        success: true,
      });
  } catch (err) {
    next(err);
  }
};
