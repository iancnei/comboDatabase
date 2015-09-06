var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use("/static", express.static("public"));
app.use("/vendor", express.static("bower_components"));

var views = path.join(process.cwd(), 'views');

var mockCombo =
[
	{
		moves: "5K > c.S > 2D > BR",
		damage: 94,
		meter: 14,
		position: "Midscreen",
		notes: "Omit BR if it won't reach",
		link: "https://www.youtube.com/embed/BrmZ4leC1Pc?start=4"
	},
	{
		moves: "5D > Homing Jump > j.D > j.D > j.K > j.S > j.D (JC) > j.K > j.S > j.D > j.VV -> TO",
		damage: 126,
		meter: 29,
		position: "Midscreen",
		notes: "*On BE, omit the second j.K. On KY, RA and ZT, you must perform j.SVV to land TO.",
		link: "https://www.youtube.com/embed/BrmZ4leC1Pc?start=54"
	}
];

var mockCombo1 =
[
	{
		moves: "1 5K > c.S > 2D > BR",
		damage: 94,
		meter: 14,
		position: "Midscreen",
		notes: "Omit BR if it won't reach",
		link: "https://www.youtube.com/embed/BrmZ4leC1Pc?start=4"
	},
	{
		moves: "1 5D > Homing Jump > j.D > j.D > j.K > j.S > j.D (JC) > j.K > j.S > j.D > j.VV -> TO",
		damage: 126,
		meter: 29,
		position: "Midscreen",
		notes: "*On BE, omit the second j.K. On KY, RA and ZT, you must perform j.SVV to land TO.",
		link: "https://www.youtube.com/embed/BrmZ4leC1Pc?start=54"
	}
];

var mockUsers = 
[
	{
		email: "user@user.com",
		passwordDigest: "password",
		combos: mockCombo
	},
	{
		email: "user1@user.com",
		passwordDigest: "password1",
		combos: mockCombo1
	}
];

app.get("/", function(req, res)
{
	res.sendFile(path.join(views, "home.html"));
});

app.get("/api/combos", function(req, res)
{
	res.send(mockUsers);
});

var listener = app.listen(3000, function()
{
	console.log("Listening on port " + listener.address().port);
});
