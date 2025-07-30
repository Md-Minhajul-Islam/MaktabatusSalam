const express = require('express');
const Book = require("../models/book");


const router = express.Router();



/*
    GET
    HOME
*/
router.get('/', (req, res) => {

    locals = {
        title: 'Home',
    }
    res.render('index', { locals });
});


/*
    GET
    LIBRARY
*/
router.get('/library', async (req, res) => {
    locals = {
        title: 'Library'
    }
    try {
        const books = await Book.find().sort({id: 1});
        res.render('library', {locals, books });
    }
    catch (err) {
        console.log(err);
        res.render('library', { locals, books: []});
    }
});











module.exports = router;