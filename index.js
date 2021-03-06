var express	= require('express');
var cors = require('cors');
var routes = require('./routes');
var mongoose = require('mongoose');
var config = require('./config/config');
var bodyparser =require('body-parser');
var expressvalidator = require('express-validator')

var app	= express();

//Including middlewares
app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(expressvalidator());

//Using routes from routes.js
app.use('/api',routes);

//Database connection
mongoose.connect(config.db, {useNewUrlParser: true, useCreateIndex: true});

const connection = mongoose.connection;
 
connection.once('open', () => {
    console.log('Database connection established');
});
 
connection.on('error', (err) => {
    console.log("MongoDB connection error: " + err);
    process.exit();
});

//Server start listening at port on config.js
app.listen(config.port);
console.log('I\'m running');