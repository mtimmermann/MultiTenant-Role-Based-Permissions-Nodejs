'use strict';

const winston = require('winston');
require('winston-mongodb').MongoDB;
const config = require('../../config');

const fs = require('fs');
const env = process.env.NODE_ENV || 'development';
const logDir = 'logs';

const tsFormat = () => {
  return '['+ new Date().toISOString() +']';
};

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}


const logger = new (winston.Logger) ({
  transports: [
    // Colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'debug'
    }),
    new (require('winston-daily-rotate-file'))({
      filename: `${logDir}/-results.log`,
      timestamp: tsFormat,
      datePattern: 'yyyy-MM-dd',
      prepend: true,
      level: env === 'development' ? 'verbose' : 'info'
    }),
    new (winston.transports.MongoDB)({
      db: config.logging.dbUri
    })
  ]
});

logger.log('error', 'testing...');

module.exports = logger;
