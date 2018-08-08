// Scraping tools - works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");
var mongoose = require("mongoose");

module.exports = function (app) {
    // console.log();

    // A GET route for scraping the community ed website categories
    app.get("/scrapeList", function (req, res) {

        axios.get("https://www.ed2go.com/mplscommed/").then(function (response) {

            let $ = cheerio.load(response.data);

            $(".tier1").each(function (i, element) {

                let result = {};

                // console.log(element)
                result.title = element.children[0].data;
                result.link = element.attribs.href + "&PageSize=50";
                console.log(result)

                db.class.create(result)
                    .then(function (dbClass) {
                        console.log(dbClass);
                    })
                    .catch(function (err) {
                        return res.json(err);
                    });
            });

            res.send("Scrape Complete")
        });
    });

    // Route for getting all Articles from the db
    app.get("/classes", function (req, res) {
        db.class.find()
            .then(function (dbClass) {
                res.json(dbClass);
            })
            .catch(function (err) {
                res.json(err);
            })
    });

    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/classes/:id", function (req, res) {
        id = req.params.id;
        db.class.find({ _id: id })
            .populate("note")
            .then(function (dbClass) {
                res.json(dbClass);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    // Route for saving/updating an Article's associated Note
    app.post("/classes/:id", function (req, res) {
        classId = req.params.id;
        db.note.create(req.body)
            .then(function (dbNote) {
                return db.class.findOneAndUpdate({ _id: classId }, { note: dbNote._id }, { new: true })
            })
            .then(function (dbClass) {
                res.json(dbClass);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    //   now I want to scrape all the urls that came back for all the class options but only show the subcategory that's active (clicked on)


};