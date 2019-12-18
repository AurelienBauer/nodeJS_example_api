import jwt from 'jsonwebtoken';
import httpStatus from "http-status";
import {ErrorApi} from "../services/ErrorApi.service";
import {UserModel} from "../models/user.model";

const checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return next(new ErrorApi({
                    status: httpStatus.UNAUTHORIZED,
                    message: 'Token is not valid'
                }));
            } else {
                const user = await UserModel.getUserByEmail(decoded.email);
                req.user = user;
                next();
            }
        });
    } else {
        return next(new ErrorApi({
            status: httpStatus.UNAUTHORIZED,
            message: 'Auth token is not supplied'
        }));
    }
};

module.exports = { checkToken };