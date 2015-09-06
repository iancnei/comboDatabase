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

var mockUsers = 
[
	{
		email: "user@user.com",
		passwordDigest: "password",
		combos: []
	},
	{
		email: "user1@user.com",
		passwordDigest: "password1",
		combos: []
	}
];

// db.User.remove({}, function(err, removedUsers)
// {
// 	if(err)
// 	{
// 		return console.log(err);
// 	}
// 	db.User.create(mockUsers, function(err, createdUsers)
// 	{
// 		if(err)
// 		{
// 			return console.log(err);
// 		}
// 		console.log("Created users:\n", createdUsers);
// 		process.exit(0);
// 	});
// });

db.User.findOne({email: "user@user.com"}, function(err, foundUser)
{
	if(err)
	{
		return console.log(err);
	}
	foundUser.combos.push(mockCombo1);
	foundUser.save(function(err, success)
	{
		if(err)
		{
			return console.log(err);
		}
		console.log("Combo added:", success);
	});
});

db.User.findOne({email: "user1@user.com"}, function(err, foundUser)
{
	if(err)
	{
		return console.log(err);
	}
	foundUser.combos.push(mockCombo2);
	foundUser.save(function(err, success)
	{
		if(err)
		{
			return console.log(err);
		}
		console.log("Combo added:", success);
	});
});