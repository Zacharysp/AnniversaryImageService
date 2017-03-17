/**
 * Created by dzhang on 2/27/17.
 */

var kafka = require('kafka-node');
var fs = require('fs');
var protobuf = require('protocol-buffers');
var messages = protobuf(fs.readFileSync(process.cwd() + '/utilities/anniversary.proto'));
var ops = require('../controller/imageOps');

var options = {
    host: 'localhost:2181',
    groupId: 'image-group',
    sessionTimeout: 15000,
    protocol: ['roundrobin'],
    fromOffset: 'latest',
    outOfRangeOffset: 'earliest',
    encoding: 'buffer'
};

var ConsumerGroup = kafka.ConsumerGroup;
var consumerGroup = new ConsumerGroup(options, 'imageService');

//listen on message
consumerGroup.on('message', function (message) {
    var imageMessage = messages.ImageMessage.decode(message.value);
    processService(imageMessage);
});

consumerGroup.on('connect', function () {
    logger.info("Kafka connect success, consumer group started");
});

consumerGroup.on('error', function (err) {
    logger.error(err);
    //will consumer on error, shut up process and restart
    return process.exit(1);
});

consumerGroup.on('offsetOutOfRange', function (err) {
    //TODO
    logger.error(err)
});

module.exports = consumerGroup;

function processService(imageMessage) {
    logger.info('Incoming messages: ', imageMessage);
    imageMessage.fileNames.forEach(function(filename){
       doJob(filename, imageMessage.action, imageMessage.type);
    });
}

function doJob(filename, action, type){
    switch (action) {
        case 1:
            ops.resizeImage(filename, type);
            break;
        case 2:
            ops.deleteFile(filename);
            break;
        default:
            logger.info('No action found: ', action);
            break;
    }
}