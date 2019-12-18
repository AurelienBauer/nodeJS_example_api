import { logger } from '../services/logger.service';
import {ErrorApi} from '../services/ErrorApi.service';
import httpStatus from "http-status";

/**
 * Error handler. Send stacktrace only during development
 * @public
 */

export const handler = (err, req, res, next) => {
    if (!(err instanceof ErrorApi)) {
      err = new ErrorApi(err);
    }
    const response = {
        code: err.status |- err.statusCode,
        message: err.message,
        errors: err.errors,
        stack: err.stack,
        success: false
    };

    logger.error(err);

    res.status(response.code).json(response);
};

export const notFound = (req, res, next) => {
    const err = new ErrorApi({
        status: httpStatus.NOT_FOUND,
    });

    handler(err, req, res);
};