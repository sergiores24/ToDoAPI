var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
	name: String,
	status: String,
<<<<<<< HEAD
	activities: [{
		description: String,
		status: String,
	}],
=======
>>>>>>> bb22b9cd7479a5fe9d0f84fc9c1c114233deda26
	users: [{type: Schema.Types.ObjectId, ref:'User'}]
});

module.exports = mongoose.Model('Task',TaskSchema)