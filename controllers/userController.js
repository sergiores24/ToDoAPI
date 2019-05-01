var User 	= require('../models/user');
var {body,validationResult} = require('express-validator/check');

exports.validator = (method)=>{
	switch(method){
		case 'registerUser':{
			return [
				body('name','There\'s no name').exists(),
				body('surname','There\'s no surname').exists(),
				body('email','Not a valid email').optional().isEmail()
			]
		}
	}
};

exports.registerUser= (req,res) => {
	const errors = validationResult(req);
	if(!errors.isEmpty()){return res.status(500).json({errors: errors.array()});}

	var userModel=User({
		name: 		req.body.name,
		surname:	req.body.surname,
		email:		req.body.email
	});

	userModel.save((err,user)=>{
		if(err){ return res.status(500).json(err);}
		res.status(200).json(user);
	});
};

exports.getUsers=(req,res) =>{
	var queryOps={};
	if(req.query.users){
		var userIds=JSON.parse(req.query.users);
		if(Array.isArray(userIds)){
			queryOps={_id:{$nin: userIds}};
		}
	}
	User.find(queryOps,(err,users)=>{
		if(err) return res.status(500).send('Could not find users');
		return res.json(users);
	});
}