var Task 	= require('../models/task');
var User	= require('../models/user');
var {body,validationResult} = require('express-validator/check');

exports.validator=(method)=>{
	switch(method){
		case 'createTask':{
			return [
				body('name','Not name provided').exists().isSting(),
				body('activities','Not an array').optional().isArray(),
				body('users','Not an array').optional().isArray(),
			]
		}
	}
}

exports.createTask=(req,res)=>{
	const errors = validationResult(req);
	if(!errors.isEmpty()){return res.status(500).json({errors: errors.array()});}

	if(req.body.users){
		var ids =req.body.users;
		var length = ids.length;
		ids.forEach((id)=>{
			id= mongoose.Types.ObjectId(id);
		});
		User.find({_id:{$in:ids}},(err,users)=>{
			if(err) return res.status(500).send('Users could not be found');
			if(!users) return res.status(404).send('Users not found');
			if(users.length!=length) return res.status(404).send('One or more users not found');
			var taskModel=Task({
				name: req.body.name,
				status: 'Open',
				activities: req.body.activities,
				users: req.body.users
			});
			taskModel.save((err,task)=>{
				if(err) return res.status(500).send('Task could not be created');
				return res.json(task);
			})
		}
	}
}