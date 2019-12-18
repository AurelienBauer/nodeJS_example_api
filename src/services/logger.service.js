import { createLogger, format, transports } from "winston";

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'DD/MM/YYYY HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: 'blank-api' },
    transports: [
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple()
        )
    }));
}

function logError(err, req, res, next) {
    console.dir(err);
    logger.error(err);
    next();
}

function logRequest(req, res, next) {
    logger.info(req.url);
    next();
}

module.exports = { logger, logError, logRequest };