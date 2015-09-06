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

var listener = app.listen(3000, function()
{
	console.log("Listening on port " + listener.address().port);
});
