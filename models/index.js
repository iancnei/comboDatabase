var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/comboDatabase");

module.exports.User = require("./user");