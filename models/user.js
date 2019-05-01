var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: String,
	surname:String,
	email: {type: String, unique: true, sparse: true}
},{ timestamps: { createdAt: 'created_at' }});

module.exports=mongoose.model('User',UserSchema);