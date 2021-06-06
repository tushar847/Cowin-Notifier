const {
    createLogger,
    format,
    transports
} = require('winston');

const serviceLogger = createLogger({
    transports: new transports.File({
        filename: 'logs/service.log',
        format: format.combine(
            format.timestamp({
                format: 'MMM-DD-YYYY HH:mm:ss'
            }),
            format.align(),
            format.printf(info => `${[info.level]}: ${[info.timestamp]}: ${info.message}`),
        )
    }),
});

const interfaceLogger = createLogger({
    transports: new transports.File({
        filename: 'logs/interface.log',
        format: format.combine(
            format.timestamp({
                format: 'MMM-DD-YYYY HH:mm:ss'
            }),
            format.align(),
            format.printf(info => `${[info.level]}: ${[info.timestamp]}: ${info.message}`),
        )
    }),
});

const smsLogger = createLogger({
    transports: new transports.File({
        filename: 'logs/sms.log',
        format: format.combine(
            format.timestamp({
                format: 'MMM-DD-YYYY HH:mm:ss'
            }),
            format.align(),
            format.printf(info => `${[info.level]}: ${[info.timestamp]}: ${info.message}`),
        )
    }),
});

const hmLogger = createLogger({
    transports: new transports.File({
        filename: 'logs/hm.log',
        format: format.combine(
            format.timestamp({
                format: 'MMM-DD-YYYY HH:mm:ss'
            }),
            format.align(),
            format.printf(info => `${[info.level]}: ${[info.timestamp]}: ${info.message}`),
        )
    }),
});

module.exports = {
    serviceLogger,
    interfaceLogger,
    smsLogger,
    hmLogger
}