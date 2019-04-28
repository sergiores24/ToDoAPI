var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
	name: String,
	status: String,
	activities: [String],
	users: [{type: Schema.Types.ObjectId, ref:'User'}]
},{ timestamps: { createdAt: 'created_at' }});

module.exports = mongoose.model('Task',TaskSchema)