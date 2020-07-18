const express = require('express');
const router = express();
const mongoose = require('mongoose');
const {Customer, validate} = require('../models/customer');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/async');
const validateObjectId = require('../middleware/validateObjectId');


// Fethcing all Customers 
router.get('/', asyncMiddleware(async (req, res) => {  
    const customer = await Customer.find().sort('name');
    
    res.send(customer);
}));

//Fetching a single customer 
router.get('/:id', validateObjectId, asyncMiddleware(async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if(!customer) return res.status(404).send('Customer not found') // I/P Id Validation 

    res.send(customer);  
}));

// Adding new customer
router.post('/', auth, asyncMiddleware(async (req,res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message); // I/P Data Validation using JOI
    
    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold,
    });
    customer = await customer.save();

    res.send(customer);
}));

// Updating existing customer
router.put('/:id', [auth, validateObjectId ], asyncMiddleware(async (req, res) =>{
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message); // I/P Data Validation by JOI

    const customer = await Customer.findByIdAndUpdate(req.params.id, 
        {name: req.body.name, 
        isGold: req.body.isGold, 
        phone: req.body.phone}, 
        {new: true});
    if(!customer) return res.status(404).send('Customer Id not found') // I/P Id Validation

    res.send(customer);
}));

//Deleting Customers 
router.delete('/:id', [auth, validateObjectId], asyncMiddleware(async (req, res) => {  
    const customer = await Customer.findByIdAndRemove(req.params.id); 
    if(!customer) return res.status(404).send('Customer Id not found') // I/P Id Validation

    res.send(customer);
}));

module.exports = router;

