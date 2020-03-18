// var winston = require('winston');
// var  CloudWatchTransport = require('winston-aws-cloudwatch');

// const logger = new winston.createLogger({
//   transports: [
//     new (winston.transports.Console)({
//       timestamp: true,
//       colorize: true,
//     })
//   ]
// });

// var config = {
//   logGroupName: 'csye6225',
//   logStreamName: 'webapp',
//   createLogGroup: false,
//   createLogStream: true,
// //   awsConfig: {
// //     accessKeyId: process.env.CLOUDWATCH_ACCESS_KEY_ID,
// //     secretAccessKey: process.env.CLOUDWATCH_SECRET_ACCESS_KEY,
// //     region: process.env.CLOUDWATCH_REGION
// //   },
//   formatLog: function (item) {
//     return item.level + ': ' + item.message
//   }
// }

// logger.level = process.env.LOG_LEVEL;

// logger.stream = {
//   write: function(message, encoding) {
//     logger.info(message);
//   }
// };

// module.exports = logger;

const winston = require('winston');
const path = require('path');
var dir = '/opt/aws/amazon-cloudwatch-agent/logs';
// const logConfiguration = {
    
// }

const logger = winston.createLogger({
    format:winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
        ),
    transports: [
    //new winston.transports.Console()
    new winston.transports.File({
        filename: path.resolve(dir, '/webapp.log')
    })
]});
//console.log(__dirname);
//logger.info('all books retrieved');
module.exports = logger;