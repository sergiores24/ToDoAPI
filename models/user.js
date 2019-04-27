var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: String,
<<<<<<< HEAD
	surname:String,
	email: {type: String, unique: true},
	password: String
});

module.exports=mongoose.model('User',UserSchema);
=======
});
>>>>>>> bb22b9cd7479a5fe9d0f84fc9c1c114233deda26
