const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function() {
    //Connecting with MongoDB Database
    const db = config.get('db');
    mongoose.connect(db , {useNewUrlParser: true})
        .then(() => winston.info(`Connected to ${db}...`));
}