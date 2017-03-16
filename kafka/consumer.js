/**
 * Created by dzhang on 2/27/17.
 */

var kafka = require('kafka-node');

var options = {
    host: 'localhost:2181',
    groupId: 'image-group',
    sessionTimeout: 15000,
    protocol: ['roundrobin'],
    fromOffset: 'latest',
    outOfRangeOffset: 'earliest'
};

var ConsumerGroup = kafka.ConsumerGroup;
var consumerGroup = new ConsumerGroup(options, 'imageService');
// var client = new kafka.Client("localhost:2181");
// var consumer = new HighLevelConsumer(
//     client,
//     [
//         {topic: 'imageService'}
//     ],
//     {
//         groupId: 'image-group'
//     }
// );

//listen on message
consumerGroup.on('message', function (message) {
    logger.info(message);
    // set 1 second time out for analyzation cost

});


consumerGroup.on('connect', function () {
    logger.info("Connect success, consumer group started");
});

consumerGroup.on('error', function (err) {
    //TODO
    logger.error(err)
});

consumerGroup.on('offsetOutOfRange', function (err) {
    //TODO
    logger.error(err)
});

module.exports = consumerGroup;