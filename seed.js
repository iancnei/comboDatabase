var db = require("./models");

var mockCombo1 =
{
	moves: "5K > c.S > 2D > BR",
	damage: 94,
	meter: 14,
	position: "Midscreen",
	notes: "Omit BR if it won't reach",
	link: "https://www.youtube.com/embed/BrmZ4leC1Pc?start=4"
}

var mockCombo2 = 
{
	moves: "5D > Homing Jump > j.D > j.D > j.K > j.S > j.D (JC) > j.K > j.S > j.D > j.VV -> TO",
	damage: 126,
	meter: 29,
	position: "Midscreen",
	notes: "*On BE, omit the second j.K. On KY, RA and ZT, you must perform j.SVV to land TO.",
	link: "https://www.youtube.com/embed/BrmZ4leC1Pc?start=54"
}

// db.User.findOne({email: "user@site.com"}, function(err, foundUser)
// {
// 	if(err)
// 	{
// 		return console.log(err);
// 	}
// 	if(foundUser !== null)
// 	{
// 		foundUser.combos.push(mockCombo1);
// 		foundUser.save(function(err, success)
// 		{
// 			if(err)
// 			{
// 				return console.log(err);
// 			}
// 			console.log("Combo added:", success);
// 		});
// 	}
// 	else
// 	{
// 		console.log("no user");
// 	}
// });

// db.User.remove({}, function(err, removedUsers)
// {
// 	if(err)
// 	{
// 		return console.log(err);
// 	}
// 	db.User.createSecure("user@site.com", "secure", function(err, createdUser)
// 	{
// 		if(err) return console.log(err);
// 		console.log("created 'user@site.com' with password 'secure'.\n", createdUser);
// 	});
// });

// db.User.authenticate("user@site.com", "secure", function(err, result)
// {
// 	if(err) return console.log(err);
// 	console.log(result);
// 	process.exit(0);
// });

var user = {email: "user@site.com"};

// db.User.createCombo(user, mockCombo1, function(err, userCombo)
// {
// 	if(err)
// 	{
// 		console.log(err);
// 		process.exit(0);
// 	}
// 	else
// 	{
// 		console.log(userCombo);
// 		// process.exit(0);
// 	}
// })

// db.User.createCombo(user, mockCombo2, function(err, userCombo)
// {
// 	if(err)
// 	{
// 		console.log(err);
// 		process.exit(0);
// 	}
// 	else
// 	{
// 		console.log(userCombo);
// 		// process.exit(0);
// 	}
// })

db.User.find({position: "Midscreen"}, function(err, foundUsers)
{
	if(err) return console.log(err);
	console.log(foundUsers);
	process.exit(0);
})