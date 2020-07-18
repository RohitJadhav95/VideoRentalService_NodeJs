const express = require('express');
const router = express();
const mongoose = require('mongoose');
const {Genre, validate} = require('../models/genre');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/async');
const error = require('../middleware/error');
const validateObjectId = require('../middleware/validateObjectId');


// Fethcing all genre values 
router.get('/', asyncMiddleware(async (req, res) => {
// router.get('/', async (req, res) => {
    const genre = await Genre.find().sort('name');
    
    res.send(genre);
}));

//Fetching a single genre 
router.get('/:id',  validateObjectId ,asyncMiddleware(async (req, res) => {
// router.get('/:id', async (req, res) => {

        const genre = await Genre.findById({_id: req.params.id});

        if(!genre) return res.status(404).send('Genre Id not found') // I/P Id Validation 
    
        res.send(genre);  
}));

// Adding new genres
// router.post('/', auth, asyncMiddleware(async (req,res) => {
router.post('/', async (req,res) => {

    console.log(req.body);    
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message); // I/P Data Validation using JOI
    
    let genre = new Genre({name: req.body.name});
    genre = await genre.save();

    res.send(genre);
});

// Updating existing genres
router.put('/:id', [auth, validateObjectId], asyncMiddleware(async (req, res) =>{
// router.put('/:id', auth, async (req, res) =>{

        const {error} = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message); // I/P Data Validation using JOI

        const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true});
        if(!genre) return res.status(404).send('Genre Id not found') // I/P Id Validation

        res.send(genre);
}));

router.delete('/:id', [auth, validateObjectId], asyncMiddleware(async (req, res) => {
// router.delete('/:id', auth, async (req, res) => {

        const genre = await Genre.findByIdAndRemove(req.params.id); 
        if(!genre) return res.status(404).send('Genre Id not found') // I/P Id Validation

        res.send(genre);
}));

module.exports = router;