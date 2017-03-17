/**
 * Created by dzhang on 3/16/17.
 */

"use strict";
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var util = require('../utilities').util;
var gm = require('gm').subClass({ imageMagick: true });

var normalSize = [60, 80];
var avatarSize = [50, 50];

exports.deleteFile = function (filename) {
    if (!filename)  return;
    var gfs = Grid(mongoose.connection.db, mongoose.mongo);
    //check if file existed
    gfs.exist({filename: filename}, function (err, found) {
        if (err) return util.handleError(err);
        if (found) {
            //delete file
            gfs.remove({filename: filename}, function (err) {
                if (err) return util.handleError(err);
                logger.info('deleted file:', filename);
            });
        }
        else logger.info('no file: ', filename);
    });

};

exports.resizeImage = function (filename, type) {
    if (!filename)  return;
    var gfs = Grid(mongoose.connection.db, mongoose.mongo);

    //find size with type
    var size = type == 1 ? avatarSize : normalSize;

    //check if file existed
    gfs.exist({filename: filename}, function (err, found) {
        if (err) return util.handleError(err);
        if (found) {
            try {
                resizeImage(filename, gfs, size)
            } catch (err) {
                util.handleError(err);
            }
        }
        else logger.info('no file: ', filename);
    });
};

function resizeImage(filename, gfs, size){
    var readStream = gfs.createReadStream({filename: filename});
    readStream.on('error', function (err) {
        throw err;
    });

    // new file name rule: example.jpg -> example_low.jpg
    var strs = filename.split('.');
    var newFileName = [strs[0] + '_low', strs[1]].join('.');
    logger.info(newFileName);

    //resize image
    gm(readStream, 'filename')
        .noise('laplacian')
        .resize(size[0], size[1])
        .stream(function (err, stdout) {
            var writeStream = fileWriteStream({filename: newFileName});
            stdout.pipe(writeStream);
        });
}

function fileWriteStream(options) {
    // streaming to gridfs
    var gfs = Grid(mongoose.connection.db, mongoose.mongo);
    var writeStream = gfs.createWriteStream(options);

    writeStream.on('close', function (file) {
        logger.info(file.filename + 'Written To DB');
    });

    writeStream.on('error', function (err) {
        throw err;
    });
    return writeStream;
}