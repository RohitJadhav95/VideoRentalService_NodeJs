const Joi = require('joi');
const bcrypt = require('bcrypt'); 
const express = require('express');
const mongoose = require('mongoose');
const {User} = require('../models/user');
const asyncMiddleware = require('../middleware/async');
const router = express();

// Authenticating users
// router.post('/', asyncMiddleware(async (req,res) => {

router.post('/', async (req,res) => {

    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message); // I/P Data Validation using JOI
    
    let user = await User.findOne({email: req.body.email});
    console.log('user:', user);
    if(!user) return res.status(400).send('Invalid email or password'); 

    console.log('Passed Email Validation');
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if(!isValidPassword) return res.status(400).send('Invalid email or password');
        
    const token = user.generateAuthToken();

    res.send(token);
});



// Validation Schema for Authentication
function validate(req) {

    const schema = {
        email: Joi.string().min(10).max(255).email().required(),
        password: Joi.string().min(10).max(255).required()
    };
    const joi_var = Joi.validate(req, schema);
    console.log('joi var:', joi_var);
    return joi_var
}

module.exports = router;    