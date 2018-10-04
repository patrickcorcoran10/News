var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// var News = require("./models/News.js");
// var Note = require("./models/Note.js");

// Scraping Tools

var cheerio = require("cheerio");
var request = require("request");

// Require all models

var db = require("./models");

var PORT = 8080;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// // Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/newsApp", { useNewUrlParser: true });

var express = require("express");
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);
// Scraping Function
    
// Routes
app.get("/", function(req, res) {
    res.send("News Scraper Root Page");
});

// GET Route to scraping the CapitolFax website
app.get("/scrape", function(req, res) {
    request("http://www.capitolfax.com", function(error, response, html) {

            var $ = cheerio.load(html);

            // An empty array to save the data that we'll scrape
            var results = [];

            $("div.title").each(function(i, element) {

                var link = $(element).children().attr("href");
                var title = $(element).children().text();

                // Save these results in an object that we'll push into the results array we defined earlier
                results.push({
                title: title,
                link: link
                });
            });
            // console.log(results);
    db.News.create(results)
        .then(function(dbNews) {
            res.send(dbNews);
        })
        .catch(function(err) {
            return res.json(err);
        })
});
});
// GET Route to Post Articles to the Page
app.get("/", function(req, res) {
    db.News.find({})
        .then(function(dbNews) {
            res.json(dbNews);
        })
        .catch(function(err) {
            res.json(err);
        });
    res.send("news page");

});
// GET Route to find Specific Article by _id and Populate with Note
app.get("/news/:id", function(req, res) {
    db.News.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbNews) {
    res.json(dbNews);
    })
    .catch(function(err) {
        res.json(err);
    });
});

// POST Route for saving/updating an article's assiciated Note
app.post("/news/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote) {
        return db.News.findOneAndUpdate({ _id: req.params.id}, { note: dbNote._id }, { new: true });
    })
    .then(function(dbNews) {
        res.json(dbNews);
    })
    .catch(function(err) {
        res.json(err);
    });
});
app.listen(PORT, function() {
    console.log("App running on port " + PORT + ".");
});
