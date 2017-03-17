/**
 * Created by dzhang on 3/17/17.
 */
"use strict";
var mongoose = require('mongoose');
var CreateUpdatedAt = require('mongoose-timestamp');

var ImageFailLogSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    }
});

ImageFailLogSchema.plugin(CreateUpdatedAt);


var ImageFailLogModel = mongoose.model('Event', ImageFailLogSchema);

module.exports = ImageFailLogModel;