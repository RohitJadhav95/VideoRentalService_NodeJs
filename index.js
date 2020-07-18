// Exporting Modules
const express = require('express');
const winston = require('winston');
const dbdebugger = require('debug')('app:db');
const morgan = require('morgan');
// const { urlencoded, static } = require('express'); ..... Failing for Integration Testing
const helmet = require('helmet');

const app = express();
require('./startup/log')();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/database')();

//Checking Environment
winston.info(`Environment: ${app.get('env')}`);

// Build-In Middleware Functions
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(express.json());

//Third Party Middleware Functions
app.use(helmet());
app.use(morgan('tiny'));
app.set('view engine', 'pug');
app.set('views', './views');

//For Debugging only for Development
if (app.get('env') == 'development') {
    dbdebugger('Debugger is on...');
};

//Server Setup
const port = process.env.PORT || 3000;
const server = app.listen(3000, () => winston.info(`Listening to port ${port}.....`));

module.exports = server;
