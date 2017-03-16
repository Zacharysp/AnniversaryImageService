/**
 * Created by dzhang on 2/6/17.
 */
"use strict";

global.logger = require('./utilities/logger');

const cluster = require('cluster');
const cpuCount = require('os').cpus().length;

if (cluster.isMaster) {
    logger.info('Master cluster is running: ', process.pid);
    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function () {
        logger.info('worker died: ', process.pid);
        cluster.fork();
    });
} else {
    require('./kafka');
    logger.info('Worker is running: ', process.pid);
}
