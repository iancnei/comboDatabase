var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');
var db = require("./models");

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use("/static", express.static("public"));
app.use("/vendor", express.static("bower_components"));
app.use(session({
	secret: "aknownpubliclock",
	resave: false,
	saveUninitialized: true
}));

var views = path.join(process.cwd(), 'views');

app.get("/", function(req, res)
{
	res.sendFile(path.join(views, "home.html"));
});

app.get("/api/combos", function(req, res)
{
	db.User.find({}, function(err, foundUsers)
	{
		if(err)
		{
			return console.log(err);
		}
		res.send(foundUsers);
	})	
});

app.post("/api/signup", function(req, res)
{
	newUser = req.body;
	db.User.createSecure(newUser.email, newUser.password, function(err, createdUser)
	{
		if(err)
		{
			console.log(err);
			res.sendStatus(422);
		}
		else
		{
			// db.User.find({}, function(err, foundUsers)
			// {
			// 	res.send(foundUsers);
			// });
			res.send(newUser.email + "'s account was created.");
		}
	});
});

app.post("/api/signin", function(req, res)
{
	user = req.body;
	db.User.authenticate(user.email, user.password, function(err, authUser)
	{
		if(err) 
		{
			console.log(err);
			res.sendStatus(422);
		}
		else
		{
			res.send("sign in successful");
		}
	});
});

var listener = app.listen(3000, function()
{
	console.log("Listening on port " + listener.address().port);
});	
