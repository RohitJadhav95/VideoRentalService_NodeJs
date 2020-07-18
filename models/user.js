const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
// Joi.passwordComplexity = require('joi-password-complexity');

//Modelling Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 1024
    },
    isAdmin: Boolean
});

//Function for generating Json Web token for registered users
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
} 

const User = mongoose.model('User', userSchema );

// Validation Schema for User
function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(255).required(),
        email: Joi.string().min(10).max(255).required().email(),
        password: Joi.string().min(10).max(255).required()
    };
    return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validate = validateUser;