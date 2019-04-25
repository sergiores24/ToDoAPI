var express = require('express');
var routes=express.Router();

routes.get('',function(req,res){
	return res.send('Hello there!');
});

module.exports=routes;