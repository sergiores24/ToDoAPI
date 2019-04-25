var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CardSchema = new Schema({
	name: string,
	description: name
	tasks: [{type: Schema.Types.ObjectId,ref:'Task'}]
});

module.exports=mongoose.Model('Card',CardSchema);