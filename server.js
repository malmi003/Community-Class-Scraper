// Dependencies
// ===================================
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// Scraping tools - works on the client and on the server
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

// Initialize Express
// =====================================
var app = express();
let PORT = process.env.PORT || 3000;

// Configure middleware
// =====================================
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/week18Populater");
// I added this part....
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Routes
// =====================================
require("./routes/apiRoutes.js")(app);


// Start the server
// =====================================
app.listen(PORT, function() {
  console.log("App running on //localhost:" + PORT);
});
