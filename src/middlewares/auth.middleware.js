import jwt from 'jsonwebtoken';
import httpStatus from "http-status";

const checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res
                    .status(httpStatus.UNAUTHORIZED)
                    .json({
                    success: false,
                    message: 'Token is not valid'
                });
            } else {
                req.decoded = decoded;
                console.dir(decoded);
                next();
            }
        });
    } else {
        return res
            .status(httpStatus.UNAUTHORIZED)
            .json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }
};

module.exports = { checkToken };