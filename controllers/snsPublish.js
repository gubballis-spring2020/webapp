const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const consumer = Consumer.create({
    queueUrl: 'https://sqs.us-east-1.amazonaws.com/823301983257/csye6225-spring2020',
    messageAttributeNames: ['User', 'Bills'],
    handleMessage: async (message) => {
        console.log(message);
        // Create publish parameters
        var params = {
            Message: message.Body + ' for user ' + message.MessageAttributes['User'].StringValue + '. Link to the bills ' + message.MessageAttributes['Bills'].StringValue, /* required */
            MessageAttributes: {
                "User": {
                    DataType: "String",
                    StringValue: message.MessageAttributes['User'].StringValue
                },
                "Bills": {
                    DataType: "String",
                    StringValue: message.MessageAttributes['Bills'].StringValue
                }
            },
            TopicArn: 'arn:aws:sns:us-east-1:823301983257:sns-try'
        };

        // Create promise and SNS service object
        var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();

        // Handle promise's fulfilled/rejected states
        publishTextPromise.then(
            function (data) {
                console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
                console.log("MessageID is " + data.MessageId);
            }).catch(
                function (err) {
                    console.error(err, err.stack);
                });
    },
    batchSize: 3,
    sqs: new AWS.SQS()
});

consumer.on('error', (err) => {
    console.error(err.message);
});

consumer.on('processing_error', (err) => {
    console.error(err.message);
});

consumer.on('timeout_error', (err) => {
    console.error(err.message);
});

consumer.start();