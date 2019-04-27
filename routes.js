var express = require('express');
var routes=express.Router();
var userController = require('./controllers/userController');

routes.get('/',function(req,res){
	return res.send('Hello there!');
});
routes.post('/register',userController.validator('registerUser'),userController.registerUser)

module.exports=routes;