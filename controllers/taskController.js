var Task 	= require('../models/task');
var User 	= require('../models/user');
var TasksGroup=require('../models/tasksgroup');
var {body,validationResult} = require('express-validator/check');

//Validation rules for each method
exports.validator=(method)=>{
	switch(method){
		case 'createTask':{
			return [
				body('name','Not name provided').exists().isString(), //Name required
				body('users','Not an array').optional().isArray(), //Users IDs must be in array
				body('groupId','No Tasks group ID provided').exists() //Tasks Group ID required
			]
		}
		case 'setStatus':{
			return[
				body('taskId','No taks ID provided').exists().isString(), //Task ID is required
				body('status','Given status is invalida').exists().isIn(['Open',
					'In-Progress',
					'Completed',
					'Archived']) //Status is requied and has to be in values
			]
		}
		case 'addOrRemoveUser':{
			return[
				body('taskId','No taks ID provided').exists().isString(), //Task ID required
				body('userId','No user ID provided').exists().isString()  //User ID required
			]
		}
	}
}

exports.createTask=(req,res)=>{
	//Looking for Express-Validator errors
	const errors = validationResult(req);
	if(!errors.isEmpty()){return res.status(500).json({errors: errors.array()});}

	//Checking if the Tasks group recieved exists
	TasksGroup.findById(req.body.groupId,(err,tgroup)=>{
		if(err) return res.status(500).send('could not find the Tasks Group');
		if(!tgroup) return res.status(404).send('Tasks Group not found');
		
		//If no users ID array, then just create task
		if(!req.body.users){
			var taskModel=Task({
					name: req.body.name,
					status: 'Open',
			});
			//Save task model
			taskModel.save((err,task)=>{
				if(err) return res.status(500).send('Task could not be created');
				//Then add Task ID to the corresponding task group
				tgroup.tasks.push(task._id);
				//Save task group model
				tgroup.save((err,tg)=>{
					if(err) res.status(500).json(err);
					return res.send('Task created and added to It\'s group')
				});
			});
		}
		else{
			//In case of array check if users exist
			var ids =req.body.users;
			var length = ids.length;
			User.find({_id:{$in:ids}},(err,users)=>{
				if(err) return res.status(500).send('Users could not be found');
				if(!users) return res.status(404).send('Users not found');

				//If users array and ids array have the same length, then all users were found
				if(users.length!=length) return res.status(404).send('One or more users not found');
				var taskModel=Task({
					name: req.body.name,
					status: 'Open',
					users: req.body.users
				});
				//Saving Task model
				taskModel.save((err,task)=>{
					if(err) return res.status(500).send('Task could not be created');
					//Then add Task ID to the corresponding task group
					tgroup.tasks.push(task._id);
					//Save task group model
					tgroup.save((err,tg)=>{
						if(err) res.status(500).json(err);
						return res.send('Task created and added to It\'s group')
					});
				});
			});
		}
	});
}

//Returs all task in database
exports.getTasks=(req,res)=>{
	Task.find({},(err,tasks)=>{
		if(err) return res.status(500).send('Could not get the tasks');
		return res.json(tasks);
	});
}

//Given a Task ID returns the users assign to it
exports.getTaskUsers=(req,res)=>{
	if(!req.query.taskId) return res.status(404).send('No Task ID provided');
	//Find task and populate with users from users IDs array in task model
	Task.findById(req.query.taskId).populate('users').exec((err,task)=>{
		if(err) return res.status(500).send('Could no find tasks groups');
		if(!task) return res.status(404).send('Task not found');
		return res.json(task.users);
	});
}

exports.setStatus=(req,res)=>{
	//Looking for Express-Validator errors
	const errors = validationResult(req);
	if(!errors.isEmpty()){return res.status(500).json({errors: errors.array()});}

	//Check if given task exists
	Task.findById(req.body.taskId,(err,task)=>{
		if(err) return res.status(500).json(err);
		if(!task) return res.status(404).send('Task not found');
		//Assign new status and then save the model
		task.status=req.body.status;
		task.save((err,tsk)=>{
			if(err) return res.status(500).json(err);
			return res.send('Task\'s Status changed to '+tsk.status);
		});
	});
}

exports.addUser=(req,res)=>{
	//Looking for Express-Validator errors
	const errors = validationResult(req);
	if(!errors.isEmpty()){return res.status(500).json({errors: errors.array()});}

	//Find Task
	Task.findById(req.body.taskId,(err,task)=>{
		if(err) return res.status(500).send('Task could not be found');
		//Checking if Task exists
		if(!task) return res.status(404).send('Task not found');

		//Looking for the given User ID on users IDs array in Task model
		var isUser=task.users.includes(req.body.userId);
		if(isUser) return res.send('User has already been assigned this task');

		//If not already assigned find the user
		User.findById(req.body.userId,(err,user)=>{
			if(err) res.status(500).send('User could not be found');
			//Checking if User exists
			if(!user) return res.status(404).send('User not found');
			//Push user's ID into users IDs array in task
			task.users.push(req.body.userId);
			//save model
			task.save((err)=>{
				if(err) return res.status(500).send('Task could not be updated');
				return res.send('Task assigned to '+user.name+' '+user.surname);
			});
		});
	});
}

exports.removeUser=(req,res)=>{
	//Looking for Express-Validator errors
	const errors = validationResult(req);
	if(!errors.isEmpty()){return res.status(500).json({errors: errors.array()});}
	
	Task.findById(req.body.taskId,(err,task)=>{
		if(err) return res.status(500).send('Task could not be found');
		if(!task) return res.status(404).send('Task not found');

		//Looking for the given User ID in users IDs array on task model
		//If not found, send error message
		var index=task.users.indexOf(req.body.userId);
		if(index<=-1) return res.status(404).send('User has not been assigned to this task');
		//If found remove id from array and save changes
		task.users.splice(index,1);
		task.save((err)=>{
			if(err) res.status(500).send('Could not save the changes');
			return res.send('Task has been removed for the user');
		})
	});
}