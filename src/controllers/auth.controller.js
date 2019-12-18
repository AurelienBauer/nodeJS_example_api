import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import {ErrorApi} from "../services/ErrorApi.service";

exports.login = (req, res, next) => {
    try {
        const isAuthenticated = true; /* TODO: replace by your authentication system */
        if (!isAuthenticated) {
            return next(new ErrorApi({
                status: httpStatus.UNAUTHORIZED,
                message: "Authentication Failure",
            }));
        }

        const token = jwt.sign({email: 'useremail@shoul_be_unique.com'}, process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRATION_DELAY}
        );

        return res.status(httpStatus.OK)
            .json({
                token,
                message: "Authentication successful!",
                expired_in: process.env.JWT_EXPIRATION_DELAY,
                success: true
            });
    } catch (err) {
        next(err);
    }
};

exports.status = (req, res, next) => {
    try {
        res.status(httpStatus.OK)
            .json({
                authUser: req.user,
                status: 'authenticated',
                success: true
            });
    } catch (err) {
        next(err);
    }
};