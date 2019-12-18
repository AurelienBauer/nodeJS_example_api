import {body, validationResult} from 'express-validator'
import {ErrorApi} from "../services/ErrorApi.service";
import httpStatus from "http-status";

const checkResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorApi({
            status: httpStatus.FORBIDDEN,
            message: "Validation error",
            errors: errors.array(),
        }));
    }
    next();
};

module.exports = { checkResult };
