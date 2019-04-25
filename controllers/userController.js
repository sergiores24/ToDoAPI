var User 	= require('../models/user');
var {check} 	= require('express-validator/check');
var bcrypt 	= require('bcrypt');
var jwt 	= require('jsonwebtoken');
var config 	= require('../config/config')

exports.validator = (method)=>{
	switch(method){
		case 'registerUser':{
			return [
				check('name','There\'s no name').exists(),
				check('surname','There\'s no surname').exists(),
				check('email', 'Not valid email recieved').exists().isEmail(),
				check('password','Not a valid password').exists()
			]
		}

		case 'loginUser':{
			return [
				check('email','Email Not valid').exists().isEmail(),
				check('password','Password not valid').exists()
			]
		}
	}
};

exports.registerUser= (req,res) => {
	bcrypt.hash(req.body.password,12,(err,hash)=>{
		var userModel=User({
			name: 		req.body.name,
			surname:	req.body.surname,
			email: 		req.body.email,
			password: 	hash
		});
		userModel.save((err,user)=>{
			if(err){ return res.status(500).send('Could not create user');}
			res.status(200).json(user);
		});
	});
};

exports.loginUser=(req,res) =>{
	User.findOne({email: req.body.email},(err,user)=>{
		if(err){return res.status(500).send('Could not find user');}

		if(!user){return res.status(401).send('Invalid credentials');}
		
		bcrypt.compareSync(req.body.password,user.password,(err,cmp)=>{
			if(!cmp){return res.status(401).send('Invalid credentials');}
			var token = jwt.sign({ id: user._id }, config.secret, {
				expiresIn: 7200
		    });
		    return res.status(200).json({token: token});
		});
	});
};