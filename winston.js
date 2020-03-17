var winston = require('winston');
var  CloudWatchTransport = require('winston-aws-cloudwatch');

const logger = new winston.createLogger({
  transports: [
    new (winston.transports.Console)({
      timestamp: true,
      colorize: true,
    })
  ]
});

var config = {
  logGroupName: 'csye6225',
  logStreamName: 'webapp',
  createLogGroup: false,
  createLogStream: true,
//   awsConfig: {
//     accessKeyId: process.env.CLOUDWATCH_ACCESS_KEY_ID,
//     secretAccessKey: process.env.CLOUDWATCH_SECRET_ACCESS_KEY,
//     region: process.env.CLOUDWATCH_REGION
//   },
  formatLog: function (item) {
    return item.level + ': ' + item.message
  }
}

logger.level = process.env.LOG_LEVEL;

logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  }
};

module.exports = logger;