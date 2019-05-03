var User 	= require('../models/user');
var Task	= require('../models/task');
var {body,validationResult} = require('express-validator/check');

//Validation rules for each method
exports.validator = (method)=>{
	switch(method){
		case 'registerUser':{
			return [
				body('name','There\'s no name').exists(),		//Name required
				body('surname','There\'s no surname').exists(),	//Surname required
				body('email','Not a valid email').optional().isEmail() //Email optinal, must be a valid email
			]
		}
	}
};

exports.registerUser= (req,res) => {
	//Looking for Express-Validator errors
	const errors = validationResult(req);
	if(!errors.isEmpty()){return res.status(400).json({errors: errors.array()});}

	//Creating User model and then saves it
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

//Find all users and send them
//Recieves one array parameter with ids of users to omit
exports.getUsers=(req,res) =>{
	var queryOps={};
	if(req.query.users){
		var userIds=JSON.parse(req.query.users);
		if(Array.isArray(userIds)){
			queryOps={_id:{$nin: userIds}};
		}
	}
	User.find(queryOps,(err,users)=>{
		if(err) return res.status(500).json(err);
		return res.json(users);
	});
}

//Returns task assigned to the user
exports.getUserTasks=(req,res)=>{
	if(!req.query.userId) return res.status(400).send('No User ID  provided');
	Task.find({users: req.query.userId},(err,tasks)=>{
		if(err) return res.status(500).json(err);
		if(!tasks) return res.status(404).send('No task found');

		return res.json(tasks);
	});
}