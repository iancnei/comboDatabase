var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");

var comboSchema = new Schema(
{
	
	// stretch goal: sort combos by characters per game
	/* game: String,
	character: String, */

	moves: String,
	damage: Number,
	meter: Number,
	position: String,
	notes: String,
	link: String
});

var userSchema = new Schema(
{

	// stretch goal: include user names
	// username: String,

	email: String,
	passwordDigest: String,
	combos: [comboSchema]
});

userSchema.statics.create = function(email, password, cb)
{
	var _this = this;
	bcrypt.genSalt(11, function(err, salt)
	{
		if(err) cb(err, null);
		bcrypt.hash(password, salt, function(err, digest)
		{
			newUser = 
			{
				email: email,
				passwordDigest: digest
			};
			
			if(err) cb(err, null);
			_this.create(newUser, function(err, createdUser)
			{
				if(err) cb(err, null);
				cb(null, createdUser);
			});
		});
	});
}

userSchema.statics.authenticate = function(email, password, cb)
{
	wantedUser = 
	{
		email: email
	};

	this.findOne(wantedUser, function(err, foundUser)
	{
		if(err) cb(err, null);
		if(foundUser === null)
		{
			cb("No User", null);
		}
		else
		{
			if(foundUser.checkPassword(password))
			{
				cb(null, foundUser);
			}
			else
			{
				cb("Incorrect Password", null);
			}
		}
	});
}

userSchema.methods.checkPassword = function(password)
{
	bcrypt.compare(password, this.passwordDigest, function(err, result)
	{
		if(err)
		{
			return console.log(err);
		}
		return result;
	});
}

var Combo = mongoose.model("Combo", comboSchema);
var User = mongoose.model("User", userSchema);

module.exports = User;