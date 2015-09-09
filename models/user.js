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

userSchema.statics.createSecure = function(email, password, cb)
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

userSchema.statics.createCombo = function(email, combo, cb)
{
	this.findOne(email, function(err, foundUser)
	{
		foundUser.combos.push(combo);
		foundUser.save(function(err, success)
		{
			if(err) cb(err, null);
			if(success)
			{
				cb(null, foundUser);
			}
			else
			{
				cb("Combo not added successfully.", null);
			}
		});
	});
}

userSchema.methods.checkPassword = function(password)
{
	return bcrypt.compareSync(password, this.passwordDigest);
}

var Combo = mongoose.model("Combo", comboSchema);
var User = mongoose.model("User", userSchema);

module.exports = User;