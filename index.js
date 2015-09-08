var express = require('express');
var bodyParser = require('body-parser');
// var cookieParser = require('cookie-parser');
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

app.use(function(req, res, next)
{
	req.signIn = function(user)
	{
		if(req.cookies !== undefined)
		{
			if(req.cookies.session)
			{
				res.cookie("session", user._id, { expires: 7, path: "/"});
			}
		}
		req.session.userId = user._id;
	};

	req.currentUser = function(cb)
	{
		db.User.findOne({ _id: req.session.userId}, function(err, foundUser)
		{
			if(err)
			{
				cb(err, null);	
			} 
			else
			{
				req.user = foundUser;
				cb(null, foundUser);
			}
		})
	}

	req.signOut = function()
	{
		res.clearCookie("session");
		req.session.userId = null;
		req.user = null;
	}

	next();
});

var views = path.join(process.cwd(), 'views');

app.get("/", function(req, res)
{
	res.sendFile(path.join(views, "home.html"));
});

// app.get("/signup", function(req, res)
// {
// 	console.log(req.session);
// 	req.currentUser(function(err, currUser)
// 	{
// 		if(err) console.log(err);
// 		if(!currUser)
// 		{
// 			res.sendFile(path.join(views, "signup.html"));
// 		}
// 		else
// 		{
// 			res.redirect("/profile");
// 		}
// 	});
// });

// app.get("/signin", function(req, res)
// {
// 	console.log(req.session);
// 	req.currentUser(function(err, currUser)
// 	{
// 		if(err) console.log(err);
// 		if(!currUser)
// 		{
// 			// res.sendFile(path.join(views, "signin.html"));
// 		}
// 		else
// 		{
// 			// res.redirect("/profile");
// 		}
// 	});
// });

// app.get("/profile", function(req, res)
// {
// 	req.currentUser(function(err, currUser)
// 	{
// 		if(err) console.log(err);
// 		if(!currUser)
// 		{
// 			res.redirect("/signin");
// 		}
// 		else
// 		{
// 			res.sendFile(path.join(views, "profile.html"));
// 		}
// 		// res.send("Hello " + currUser.email);
// 	});
// });

app.get("/api/signOut", function(req, res)
{
	req.signOut()
	console.log(req.session);
	res.sendStatus(200);
})

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
			req.signIn(createdUser);
			console.log(req.session);
			res.sendStatus(200);
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
			req.signIn(authUser);
			// res.redirect("/profile");
			console.log(req.session);
			res.sendStatus(200);
		}
	});
});

var listener = app.listen(3000, function()
{
	console.log("Listening on port " + listener.address().port);
});	
