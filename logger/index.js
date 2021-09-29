const winston = require('winston')
const { format, createLogger, transports } = require('winston');
const { combine, timestamp, printf } = format;


const logger = createLogger({
    level: 'info',

    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: 'userActivityTracking' },
    transports: [
        // new winston.transports.File({ filename: './logs/access.log', level: 'http' }),
        new winston.transports.File({ filename: './logs/application/error.log', level: 'error' }),
        new winston.transports.File({ filename: './logs/application/server.log' })

    ],
});
logger.add(new winston.transports.Console({
    format: winston.format.simple(),
}));




const accessLogger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: 'userActivityTracking' },
    transports: [
        new winston.transports.File({ filename: './logs/access/server.log' }),
    ],
});



accessLogger.add(new winston.transports.Console({
    format: format.json()

}));


module.exports.logger = logger;
module.exports.accessLogger = accessLogger;