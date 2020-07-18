const express = require('express');
const router = express();
const mongoose = require('mongoose');
const {Movie, validate} = require('../models/movie');
const {Genre} = require('../models/genre');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/async');
const validateObjectId = require('../middleware/validateObjectId');

// Fethcing all movies 
router.get('/', asyncMiddleware(async (req, res) => {
    
    const movie = await Movie.find().sort('title');
    
    res.send(movie);
}));

//Fetching a single genre 
router.get('/:id', validateObjectId ,asyncMiddleware(async (req, res) => {
    const movie = await Movie.findById({_id: req.params.id});
    if(!movie) return res.status(404).send('Movie Id not found') // I/P Id Validation 
    
    res.send(movie);  
}));

// Adding new Movie
router.post('/', auth, asyncMiddleware(async (req,res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message); // I/P Data Validation using JOI
    
    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404).send('Invalid Genre') // I/P Id Validation 

    let movie = new Movie({
    title: req.body.title, 
    genre: {
        _id: genre._id,
        name: genre.name
    }, 
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate 
    });
    movie = await movie.save();

    res.send(movie);
}));

// Updating existing Movie
router.put('/:id', [auth, validateObjectId], asyncMiddleware(async (req, res) =>{
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message); // I/P Data Validation using JOI

    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title, 
        genre: req.body.genre, 
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
        }, 
        {new: true});
    if(!movie) return res.status(404).send('Movie Id not found') // I/P Id Validation

    res.send(movie);    
}));

router.delete('/:id', [auth, validateObjectId], asyncMiddleware(async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id); 
    if(!movie) return res.status(404).send('Movie Id not found') // I/P Id Validation

    res.send(movie);s
}));

module.exports = router;