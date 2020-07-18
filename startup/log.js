const winston = require('winston');
require('winston-mongodb');

module.exports = function() {
    // // Logging Uncaught Exception
    // process.on('uncaughtException', (error) => {
    //    console.log('Uncaught Exception');
    //    winston.error(error.message, error); 
    // });

    //Alternative method to Log Uncaught Exceptions
    winston.handleExceptions(
        new winston.transports.File({filename: 'vidly_exceptionlog.log'}),
        new winston.transports.Console({colorize: true, prettyPrint: true})
        );

    // Logging Async Unhandled Rejections (like Promise Rejections)
    process.on('unhandledRejection', (error) => {
        // console.log('Uncaught Exception');
        // winston.error(error.message, error); 

        // Alternatively
        throw error;
    });

    // Logging Errors to a file
    winston.add(winston.transports.File, {filename: 'vidly_logfile.log'});
    winston.add(winston.transports.MongoDB, {
        db: 'mongodb://localhost/vidly',
        level: 'info'
});
}