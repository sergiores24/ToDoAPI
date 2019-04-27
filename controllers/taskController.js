var Task 	= require('../models/task');
var User	= require('../models/user');
var {body,validationResult} = require('express-validator/check');

exports.validator=(method)=>{
	switch(method){
		case 'createTask':{
			return [
				body('name','Not name provided').exists().isString(),
				body('activities','Not an array').optional().isArray(),
				body('users','Not an array').optional().isArray(),
			]
		}
	}
}

exports.createTask=(req,res)=>{
	const errors = validationResult(req);
	if(!errors.isEmpty()){return res.status(500).json({errors: errors.array()});}

	if(!req.body.users){
		var taskModel=Task({
				name: req.body.name,
				status: 'Open',
				activities: req.body.activities
		});
		taskModel.save((err,task)=>{
			if(err) return res.status(500).send('Task could not be created');
			return res.json(task);
		});
	}
	else{
		var ids =req.body.users;
		var length = ids.length;
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
			});
		});
	}
}

exports.getTaskUsers=(req,res)=>{
	Task.findById(req.body.taskId).populate('users').exec((err,task)=>{
		if(err) return res.status(500).send('could no find tasks groups');
		return res.json(task.users);
	});
}