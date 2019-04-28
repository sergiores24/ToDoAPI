var Task 	= require('../models/task');
var User 	= require('../models/user');
var TasksGroup=require('../models/tasksgroup');
var {body,validationResult} = require('express-validator/check');

exports.validator=(method)=>{
	switch(method){
		case 'createTask':{
			return [
				body('name','Not name provided').exists().isString(),
				body('activities','Not an array').optional().isArray(),
				body('users','Not an array').optional().isArray(),
				body('groupId','No Tasks group ID provided').exists()
			]
		}
		case 'setStatus':{
			return[
				body('taskId','No taks ID provided').exists().isString(),
				body('status','Given status is invalida').exists().isIn(['Open','In-Progress','Completed','Archived'])
			]
		}
		case 'addOrRemoveUser':{
			return[
				body('taskId','No taks ID provided').exists().isString(),
				body('userId','No user ID provided').exists().isString()
			]
		}
	}
}

exports.createTask=(req,res)=>{
	const errors = validationResult(req);
	if(!errors.isEmpty()){return res.status(500).json({errors: errors.array()});}

	TasksGroup.findById(req.body.groupId,(err,tgroup)=>{
		if(err) return res.status(500).send('could not find the Tasks Group');
		if(!tgroup) return res.status(404).send('Tasks Group not found');
		if(!req.body.users){
			var taskModel=Task({
					name: req.body.name,
					status: 'Open',
					activities: req.body.activities
			});
			taskModel.save((err,task)=>{
				if(err) return res.status(500).send('Task could not be created');
				tgroup.tasks.push(task._id);
				tgroup.save((err,tg)=>{
					if(err) res.status(500).json(err);
					return res.send('Task created and added to It\'s group')
				});
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
					tgroup.tasks.push(task._id);
					tgroup.save((err,tg)=>{
						if(err) res.status(500).json(err);
						return res.send('Task created and added to It\'s group')
					});
				});
			});
		}
	});
}

exports.getTasks=(req,res)=>{
	Task.find({},(err,tasks)=>{
		if(err) return res.status(500).send('Could not get the tasks');
		return res.json(tasks);
	});
}

exports.getTaskUsers=(req,res)=>{
	Task.findById(req.body.taskId).populate('users').exec((err,task)=>{
		if(err) return res.status(500).send('Could no find tasks groups');
		if(!task) return res.status(404).send('Task not found');
		return res.json(task.users);
	});
}

exports.setStatus=(req,res)=>{
	const errors = validationResult(req);
	if(!errors.isEmpty()){return res.status(500).json({errors: errors.array()});}

	Task.findById(req.body.taskId,(err,task)=>{
		if(err) return res.status(500).json(err);
		if(!task) return res.status(404).send('Task not found');
		task.status=req.body.status;
		task.save((err,tsk)=>{
			if(err) return res.status(500).json(err);
			return res.send('Task\'s Status changed to '+tsk.status);
		});
	});
}

exports.addUser=(req,res)=>{
	const errors = validationResult(req);
	if(!errors.isEmpty()){return res.status(500).json({errors: errors.array()});}

	Task.findById(req.body.taskId,(err,task)=>{
		if(err) return res.status(500).send('Task could not be found');
		if(!task) return res.status(404).send('Task not found');

		var isUser=task.users.some((usr_id)=>{
			return user_id.equals(req.body.userId);
		});
		if(isUser) return res.send('User has already been assigned this task');

		User.findById(req.body.userId,(err,user)=>{
			if(err) res.status(500).send('User could not be found');
			if(!user) return res.status(404).send('User not found');
			task.users.push(req.body.userId);
			task.save((err)=>{
				if(err) return res.status(500).send('Task could not be updated');
				return res.send('Task assigned to '+user.name+' '+user.surname);
			});
		});
	});
}

exports.removeUser=(req,res)=>{
	const errors = validationResult(req);
	if(!errors.isEmpty()){return res.status(500).json({errors: errors.array()});}
	
	Task.findById(req.body.taskId,(err,task)=>{
		if(err) return res.status(500).send('Task could not be found');
		if(!task) return res.status(404).send('Task not found');

		var index=task.users.indexOf(req.body.userId);
		if(index<=-1) return res.status(404).send('User has not been assigned to this task');
		task.users.splice(index,1);
		task.save((err)=>{
			if(err) res.status(500).send('Could not save the changes');
			return res.send('Task has been removed for the user');
		})
	});
}