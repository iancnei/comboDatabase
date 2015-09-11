var express = require('express');
var bodyParser = require('body-parser');
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
	console.log(req.session);
	res.sendFile( (path.join(views, "home.html")) || "/app/views/home.html");
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
	var wantedId = req.params.id.split("edit");

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
					if(combo._id.toString() === wantedId[1])
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
			// res.sendStatus(200);
			res.send(createdUser);
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
			// res.sendStatus(200);
			res.send(authUser);
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
	ids = req.params.id.split("edit");
	ownerId = ids[0];

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
				if(currUser._id.toString() !== ownerId)
				{
					res.sendStatus(401);
				}
				else
				{
					var updatedCombo = req.body;
					var wantedId = ids[1];

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
		}
	});
});

app.delete("/api/combos/:id", function(req, res)
{
	ids = req.params.id.split("close");
	ownerId = ids[0];

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
				if(currUser._id.toString() !== ownerId)
				{
					res.sendStatus(401);
				}
				else
				{
					var updatedCombo = req.body;
					var wantedId = ids[1];

					db.User.findOne({_id: currUser._id}, function(err, foundUser)
					{
						foundUser.combos.forEach(function(combo, index)
						{
							if(combo._id.toString() === wantedId)
							{
								foundUser.combos.splice(index, 1);
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
		}
	});
});

var listener = app.listen(process.env.PORT || 3000, function()
{
	console.log("Listening on port " + listener.address().port);
});	
