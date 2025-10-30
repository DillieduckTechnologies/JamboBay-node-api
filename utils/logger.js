const { createLogger, transports } = require('winston');
const { combine, timestamp, printf } = require('winston').format;

// Define log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Create logger
const logger = createLogger({
  format: combine(
    timestamp({ format: 'YYYY-MM-DD' }),
    logFormat
  ),
  transports: [
    new transports.File({ filename: `logs/error-${new Date().toISOString().slice(0, 10)}.log`, level: 'error' })
  ]
});


module.exports = logger;