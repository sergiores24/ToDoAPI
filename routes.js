var express = require('express');
var routes=express.Router();
var userController = require('./controllers/userController');
var taskController = require('./controllers/taskController');
var tgController = require('./controllers/tasksGroupController');

routes.get('/',(req,res)=>{return res.send('Hello there!');});

//User Routes
routes.get('/user/getall',userController.getUsers);
routes.get('/user/gettasks',userController.getUserTasks);
routes.post('/user/register',userController.validator('registerUser'),userController.registerUser);

//TasksGroup Routes
routes.get('/tasksgroup/getall',tgController.getTasksGroups);
routes.post('/tasksgroup/create',tgController.validator('createTasksGroup'),tgController.createTasksGroup);

//Task Routes
routes.get('/task/getall',taskController.getTasks);
routes.get('/task/getusers',taskController.getTaskUsers);
routes.post('/task/create',taskController.validator('createTask'),taskController.createTask);
routes.patch('/task/setstatus',taskController.validator('setStatus'),taskController.setStatus);
routes.patch('/task/adduser',taskController.validator('addOrRemoveUser'),taskController.addUser);
routes.patch('/task/removeuser',taskController.validator('addOrRemoveUser'),taskController.removeUser);

module.exports=routes;