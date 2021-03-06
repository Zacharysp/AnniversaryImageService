/**
 * Created by dzhang on 2/6/17.
 */
"use strict";
var config = require('config');
var mongoose = require('mongoose');
var dbConfig = config.get('dbConfig');

var connectionString = 'mongodb://' + dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.db + '';

var options = {
  db: { native_parser: true },
  server: { poolSize: 5 }
};

mongoose.connect(connectionString, options, function(err) {
  if (err) {
    logger.error('Error connecting to: ', +connectionString + '. ' + err);
    return process.exit(1);
  }
});
mongoose.Promise = require('bluebird');

var dbClient = mongoose.connection;

dbClient.on('error', function(err){
    return logger.error('Mongoose connect fail:', err);
});

dbClient.once('open', function() {
  return logger.info('Connect mongodb to: ' + connectionString);
});

module.exports.dbClient = dbClient;


