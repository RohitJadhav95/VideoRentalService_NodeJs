const Joi = require('joi');
const mongoose = require('mongoose');


//Modelling Schema
const customerSchema = new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    phone: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 15
    }
});
const Customer = mongoose.model('Customer', customerSchema);

// Validation Schema for Customer
function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(5).max(255).required(),
        phone: Joi.string().min(10).max(15).required(),
        isGold: Joi.boolean()
    };
    return Joi.validate(customer, schema);
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
