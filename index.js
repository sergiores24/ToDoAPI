var express	= require('express');
var cors = require('cors');
var routes = require('./routes');
var mongoose = require('mongoose');
var config = require('./config/config');
var bodyparser =require('body-parser');
var expressvalidator = require('express-validator')

app	= express();

app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(expressvalidator());

app.use('/api',routes);

mongoose.connect(config.db, {useNewUrlParser: true});

const connection = mongoose.connection;
 
connection.once('open', () => {
    console.log('Database connection established');
});
 
connection.on('error', (err) => {
    console.log("MongoDB connection error: " + err);
    process.exit();
});

app.listen(3000);
console.log('I\'m running');