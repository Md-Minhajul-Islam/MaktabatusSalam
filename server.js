require('dotenv').config();

const express = require('express');
const cookieParser = require("cookie-parser");
const expressLayouts = require('express-ejs-layouts');


const mongoConnect = require('./app/db/config/mongodb'); 
const Footer = require('./app/models/footer');

const app = express();
const port = process.env.PORT || 5000;

// to parse POST form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());


// connect to db
mongoConnect();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use(expressLayouts);
app.set("layout", "./layouts/main");


app.use(async (req, res, next) => {
    res.locals.footer = await Footer.findOne();
    next();
});



app.use('/', require('./app/routes/main'));
app.use('/', require('./app/routes/admin'));


app.listen(port, () => {
    console.log(`Linstening of port ${port}`);
});