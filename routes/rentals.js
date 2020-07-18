const express = require('express');
const Fawn = require('fawn');
const mongoose = require('mongoose');
const {Rental, validate} = require('../models/rental');
const {Customer} = require('../models/customer');
const {Movie} = require('../models/movie');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/async');


const router = express();
Fawn.init(mongoose);

// Fethcing all rentals 
router.get('/', asyncMiddleware(async (req, res) => {
    
    const rentals = await Rental.find().sort('-dateOut');
    
    res.send(rentals);
}));

// //Fetching a single rentals
// router.get('/:id', async (req, res) => {
//     try {
//         const genre = await Rental.findById({_id: req.params.id});

//         if(!genre) return res.status(404).send('Genre Id not found') // I/P Id Validation 
    
//         res.send(genre);  

//     } catch (error) {
//         res.send(error.message);
//     }
// });

// Adding new Rental
router.post('/', auth, asyncMiddleware(async (req,res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message); // I/P Data Validation using JOI
    
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid Customer'); // I/P Data Validation
    
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid Movie'); // I/P Data Validation
        
    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            name: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });
    
    // Without Transactions or Two Phase Commits

        // rental = await rental.save();
    
        // movie.numberInStock--;
        // await movie.save();
    
        // res.send(rental);

    // With Two Phase Commits

    try {
        new Fawn.Task()
        .save('rentals', rental)
        .update('movies', {_id: movie._id}, {$inc: {numberInStock: -1}})
        .run();

        res.send(rental);
        
    } catch (error) {
        res.status(500).send('Internal Server Error...');
    }
}));

// // Updating existing genres
// router.put('/:id', async (req, res) =>{
//     try {
//         const {error} = validate(req.body);
//         if (error) return res.status(400).send(error.details[0].message); // I/P Data Validation using JOI

//         const genre = await Rental.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true});
//         if(!genre) return res.status(404).send('Genre Id not found') // I/P Id Validation

//         res.send(genre);
        
//     } catch (error) {
//         res.send(error.message);
//     }
    
// });

// router.delete('/:id', async (req, res) => {
//     try {
//         const genre = await Rental.findByIdAndRemove(req.params.id); 
//         if(!genre) return res.status(404).send('Genre Id not found') // I/P Id Validation

//         res.send(genre);
        
//     } catch (error) {
//         res.send(error.message);
//     }
// });

module.exports = router;