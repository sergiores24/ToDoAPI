var TasksGroup 	= require('../models/tasksgroup');
var {body,validationResult} = require('express-validator/check');

//Validation rules for each method
exports.validator=(method)=>{
	switch(method){
		case 'createTasksGroup':{
			return [
				body('name','No name provided').exists().isString(), //Name is required
				body('description').optional().isString(), //Description optional, must be string
			]
		}
	}
}

exports.createTasksGroup=(req,res)=>{
	//Looking for Express-Validator errors
	const errors = validationResult(req);
	if(!errors.isEmpty()) return res.status(500).json({errors: errors.array()});
	
	//Creates Tasks group moded and then saves it
	var tasksgroup= TasksGroup({
		name: req.body.name,
		description: req.body.description,
	});
	tasksgroup.save((err,tgroup)=>{
		if(err) return res.status(500).send('Could not create the Tasks Group');
		return res.json(tgroup);
	});
}


exports.getTasksGroups=(req,res)=>{
	//Find and send all Tasks group populated with tasks
	TasksGroup.find({}).populate('tasks').exec((err,tgroups)=>{
		if(err) return res.status(500).send('could no find tasks groups');
		return res.json(tgroups);
	});
}