var TasksGroup 	= require('../models/tasksgroup');
var {body,validationResult} = require('express-validator/check');

exports.validator=(method)=>{
	switch(method){
		case 'createTasksGroup':{
			return [
				body('name','No name provided').exists().isString(),
				body('description').optional().isString(),
			]
		}
	}
}

exports.createTasksGroup=(req,res)=>{
	const errors = validationResult(req);
	if(!errors.isEmpty()) return res.status(500).json({errors: errors.array()});
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
	TasksGroup.find({}).populate('tasks').exec((err,tgroups)=>{
		if(err) return res.status(500).send('could no find tasks groups');
		return res.json(tgroups);
	});
}