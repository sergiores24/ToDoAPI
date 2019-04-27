var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TasksGroupSchema = new Schema({
	name: String,
	description: String,
	tasks: [{type: Schema.Types.ObjectId,ref:'Task'}]
});

module.exports=mongoose.model('TasksGroup',TasksGroupSchema);