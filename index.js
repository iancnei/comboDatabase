var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res)
{
	res.send("（´・ω・｀）");
});

var listener = app.listen(3000, function()
{
	console.log("Listening on port " + listener.address().port);
});
