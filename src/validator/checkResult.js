import { validationResult } from 'express-validator';
import httpStatus from 'http-status';
import ErrorApi from '../services/ErrorApi.service';

const checkResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorApi({
      status: httpStatus.FORBIDDEN,
      message: 'Validation error',
      errors: errors.array(),
    }));
  }
  return next();
};

// eslint-disable-next-line import/prefer-default-export
export { checkResult };
