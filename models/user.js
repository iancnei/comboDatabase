var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");

var comboSchema = new Schema({
	
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

var userSchema = new Schema({
	email: String,
	passwordDigest: String,
	combos: [ComboSchema]
});

var Combo = mongoose.model("Combo", comboSchema);
var User = mongoose.model("User", userSchema);

module.exports = User;