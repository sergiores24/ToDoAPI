var express = require('express');
var routes=express.Router();
var userController = require('./controllers/userController');

routes.get('/',(req,res)=>{return res.send('Hello there!');});

//User Routes
routes.get('/users',userController.getUsers);
routes.post('/register',userController.validator('registerUser'),userController.registerUser);

module.exports=routes;