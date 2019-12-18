import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';

exports.login = (req, res, next) => {
    try {
        const isAutentificated = true;
        if (!isAutentificated) {
            return res.status(httpStatus.UNAUTHORIZED)
                .json({
                    message: "Authentication Failure",
                });
        }

        const token = jwt.sign({username: 'username'}, process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRATION_DELAY}
        );
        return res.status(httpStatus.OK)
            .json({
                token,
                message: "Authentication successful!",
                expired_in: process.env.JWT_EXPIRATION_DELAY
            });
    } catch (err) {
        next(err);
    }
};

exports.register = (req, res, next) => {
    res.json('OK');
};

exports.status = (req, res, next) => {
    res.json('Authenticated !');
};