const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');

dotenv.config({path: './.env'});
const app = express();

//connect to database
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});
db.connect( (error) => {
    if(error){
        console.log(error);
    } else{
        console.log('MYSQL connected');
    }
})






const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

//parse url-encoded bodies
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
// set hbs
app.set('view engine', 'hbs');

//routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));


module.exports = app;

