var express = require('express');
var routes=express.Router();
var userController = require('./controllers/userController');
var taskController = require('./controllers/taskController');
var tgController = require('./controllers/tasksGroupController');

routes.get('/',(req,res)=>{return res.send('Hello there!');});

//User Routes
routes.get('/user/getall',userController.getUsers);
routes.post('/user/register',userController.validator('registerUser'),userController.registerUser);

//TasksGroup Routes
routes.get('/tasksgroup/getall',tgController.getTasksGroups);
routes.post('/tasksgroup/create',tgController.validator('createTasksGroup'),tgController.createTasksGroup);

//Task Routes
routes.get('/task/getusers',taskController.getTaskUsers);
routes.post('/task/create',taskController.validator('createTask'),taskController.createTask);
routes.post('/task/setstatus',taskController.validator('setStatus'),taskController.setStatus);

module.exports=routes;