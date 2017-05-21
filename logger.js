const winston = require('winston');

const logger = new winston.Logger({
    transports: [
        new winston.transports.Console({ json: false, timestamp: true }),
        new winston.transports.File({ filename: __dirname + '/export.log', json: false })
    ],
    exitOnError: true
});

module.exports = logger;
