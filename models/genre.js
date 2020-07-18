const Joi = require('joi');
const mongoose = require('mongoose');

//Modelling Schema
const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
        minlength: 5,
        maxlength: 255
    }
});
const Genre = mongoose.model('Genre', genreSchema );

// Validation Schema for Genre
function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(genre, schema);
}

module.exports.Genre = Genre;
module.exports.validate = validateGenre;
module.exports.genreSchema = genreSchema;