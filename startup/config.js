const config = require('config');

module.exports = function() {
    // Checking if JWT Secret Key is set
    if (!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: JWT Private key is not defined.');


    //Checking Configuration
    console.log("Application Name:", config.get('name'));
    console.log("Mail Server:", config.get('mail'));
}
}