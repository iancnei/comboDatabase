var express = require('express');
var bodyParser = require('body-parser');
// var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');
var db = require("./models");
// add in keygenerator of secret


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
		var date = new Date();
		date.setDate(date.getDate() + 7);
		res.cookie("session", user._id, { expires: date, path: "/"});
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
				//console.log(foundUser.email);	
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
	// if(res.cookie("session") !== undefined || res.cookie("session") !== "foo")
	// {
	// 	req.session.userId = user._id;
	// }
});

// authenticate cookie against database
// app.get("/api/rememberMe", function(req, res)
// {

// });

app.get("/api/signOut", function(req, res)
{
	req.signOut()
	console.log(req.session);
	res.sendStatus(200);
});

app.get("/api/combos", function(req, res)
{
	db.User.find({}, function(err, foundUsers)
	{
		if(err)
		{
			console.log(err);
			res.sendStatus(500);
		}
		res.send(foundUsers);
	})	
});

app.get("/api/combos/:id", function(req, res)
{
	var wantedId = req.params.id;

	db.User.find({}, function(err, foundUsers)
	{
		if(err)
		{
			console.log(err);
			res.sendStatus(500);
		}
		else
		{
			foundUsers.forEach(function(user)
			{
				user.combos.forEach(function(combo)
				{
					if(combo._id.toString() === wantedId)
					{
						res.send(combo);
					}
				});
			});
		}
	})
})

app.post("/api/signUp", function(req, res)
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

app.post("/api/signIn", function(req, res)
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

app.post("/api/newCombo", function(req, res)
{
	req.currentUser(function(err, currUser)
	{
		if(err)
		{
			console.log(err);
			res.sendStatus(422);
		}
		else
		{
			if(!currUser)
			{
				res.sendStatus(401);
			}
			else
			{
				combo = req.body;
				db.User.createCombo(currUser, combo, function(err, userCombo)
				{
					if(err)
					{
						console.log(err);
						res.sendStatus(422);
					}
					else
					{
						res.sendStatus(200);
					}
				})
			}
		}
	});
});

app.put("/api/combos/:id", function(req, res)
{
	req.currentUser(function(err, currUser)
	{
		if(err)
		{
			console.log(err);
			res.sendStatus(422);
		}
		else
		{
			if(!currUser)
			{
				res.sendStatus(401);
			}
			else
			{
				var updatedCombo = req.body;
				var wantedId = req.params.id;

				db.User.findOne({_id: currUser._id}, function(err, foundUser)
				{
					foundUser.combos.forEach(function(combo)
					{
						if(combo._id.toString() === wantedId)
						{
							combo.moves = updatedCombo.moves;
							combo.damage = updatedCombo.damage;
							combo.meter = updatedCombo.meter;
							combo.position = updatedCombo.position;
							combo.notes = updatedCombo.notes;
							combo.link = updatedCombo.link;
							foundUser.save(function(err, success)
							{
								if(err)
								{
									console.log(err);
									res.sendStatus(500);
								}
								else
								{
									// console.log(combo);
									res.sendStatus(200);
								}
							});
						}
					});
				});
			}
		}
	});
});

deleteCombo = function(foundUser, wantedId, cb)
{
	for(var i = 0; i < foundUser.combos.length; i++)
	{
		if(foundUser.combos[i]._id.toString() === wantedId)
		{
			foundUser.combos[i].remove();
			cb(null, foundUser);
		}
	}
	cb(401, null);
}

app.delete("/api/combos/:id", function(req, res)
{
	req.currentUser(function(err, currUser)
	{
		if(err)
		{
			console.log(err);
			res.sendStatus(422);
		}
		else
		{
			if(!currUser)
			{
				res.sendStatus(401);
			}
			else
			{
				var wantedId = req.params.id;
				db.User.findOne({_id: currUser._id}, function(err, foundUser)
				{
					deleteCombo(foundUser, wantedId, function(err, updatedUser)
					{
						if(updatedUser)	
						{
							foundUser.save(function(err, success)
							{
								if(err)
								{
									console.log(err);
								}
								else
								{
									cb(null, foundUser);
								}
							});
							res.sendStatus(200);
						}
						else if(err !== 401 && err !== null)
						{
							console.log(err);
							res.sendStatus(422);
						}
						else if(err === 401)
						{
							res.sendStatus(401);
						}
					})
				});
			}
		}
	})
});

var listener = app.listen(3000, function()
{
	console.log("Listening on port " + listener.address().port);
});	
