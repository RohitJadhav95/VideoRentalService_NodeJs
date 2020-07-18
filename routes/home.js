const express = require('express');
const router = express();

router.get('/', (req, res) => {
    // res.send('VIDLY Movie Rentals!!!!');
    res.render('index', {title: "VIDLY Movie Rental", message: "Welcome to VIDLY!!!"})
});

module.exports = router;