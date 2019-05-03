# ToDoAPI
This is a RESTFUL API for technical test in Condor Labs

For running this project you need to set the enviroment.
It's needed to install NodeJS if It is not installed yet.
Also you need a Mongo Database. If you don't have access to one, install MongoDB server.

Once the enviroment is ready, clone the project and open your shell and go to the ToDoAPI folder.
Excecute:
~$ npm install
Once it finnish run:
~$ node index.js

You can set the server port and the mongoDB url in "config.js" file located at "config" folder

This project was made with [Node.js](https://nodejs.org), [Express](https://expressjs.com/) framework and [MongoDB](https://www.mongodb.com/).

Libraries:
- [body-parser](https://www.npmjs.com/package/body-parser)
- [express-validator](https://express-validator.github.io/docs/)
- [mongoose](https://mongoosejs.com/)
