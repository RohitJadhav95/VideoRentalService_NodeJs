const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt'); 
const express = require('express');
const mongoose = require('mongoose');
const {User, validate} = require('../models/user');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
const validateObjectId = require('../middleware/validateObjectId');

const router = express();

//Get user details
router.get('/me', auth, asyncMiddleware(async (req, res) => {
    const user =  await User.findById(req.user._id).select('-password');
    res.send(user);
}));


// Adding new users
router.post('/', auth, asyncMiddleware(async (req,res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message); // I/P Data Validation using JOI
           
    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('User Already Registered'); // Duplicate user validation

        // Without Lodash
        // user = new User({
        //     name: req.body.name,
        //     email: req.body.email,
        //     password: req.body.password
        // });

    //With Lodash
    user = new User(_.pick(req.body, ['name', 'email', 'password']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    
    user = await user.save();
    
    // Generating Json Web Token for registered users and sending back as response header
    const token = user.generateAuthToken();

    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
}));

// // Updating existing genres
router.put('/:id', [auth, validateObjectId], asyncMiddleware(async (req, res) =>{
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message); // I/P Data Validation using JOI

    isValid = mongoose.Types.ObjectId.isValid(req.params.id);
    if (isValid) {
        const user = await User.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
            }, {new: true});
        if(!user) return res.status(404).send('User not found') // I/P Id Validation
            res.send(user); 
        }
    res.status(404).send('Invalid User Id') // I/P Id Validation  
}));


// Delete User
router.delete('/:id', [auth, admin, validateObjectId] , asyncMiddleware(async (req, res) => {
    isValid = mongoose.Types.ObjectId.isValid(req.params.id);
        
    if (isValid) {
        const user = await User.findByIdAndRemove(req.params.id); 
        if(!user) return res.status(404).send('User not found') // I/P Id Validation
            
            res.send(user);   
        }
        
    res.status(404).send('Invalid User Id') // I/P Id Validation
}));

module.exports = router;