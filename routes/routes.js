// Scraping tools - works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");
var mongoose = require("mongoose");

module.exports = function (app) {
    // console.log();

    // A GET route for scraping the community ed website categories
    app.get("/scrapeCategory", function (req, res) {

        axios.get("https://www.ed2go.com/mplscommed/").then(function (response) {

            let $ = cheerio.load(response.data);

            $(".tier1").each(function (i, element) {

                let result = {};

                // console.log(element)
                result.title = element.children[0].data;
                result.link = element.attribs.href + "&PageSize=50";
                console.log(result)

                db.Category.create(result)
                    .then(function (dbCategory) {
                        console.log(dbCategory);
                    })
                    .catch(function (err) {
                        return res.json(err);
                    });
            });

            res.send("Scrape Complete")
        });
    });


    // A GET route for scraping the community ed website classes

    // need to run this for each page that the category scrape returns, then after all the classes are scraped, you need to set the relationship with category....
    app.post("/scrapeClasses/", function (req, res) {
        console.log(req.body.url)
        let url = req.body.url;
        axios.get(url).then(function (response) {

            let $ = cheerio.load(response.data);

            $(".description").each(function (i, element) {

                let result = {};

                // console.log(element)
                result.title = element.children[1].children[1].children[0].data;
                result.link = element.children[1].children[1].attribs.href;
                console.log(result);

                // db.Class.create(result)
                //     .then(function (dbClass) {
                //         console.log(dbClass);
                //     })
                //     .catch(function (err) {
                //         return res.json(err);
                //     });
            });

            res.send("Class Scrape Complete")
        });
    });

    // Route for getting all classes from the db
    app.get("/classes", function (req, res) {
        db.Class.find()
            .then(function (dbClass) {
                res.json(dbClass);
            })
            .catch(function (err) {
                res.json(err);
            })
    });

    // Route for grabbing a specific category by id, populate it with it's note
    app.get("/categorys/:id", function (req, res) {
        id = req.params.id;
        db.Category.find({ _id: id })
            .populate("Class")
            .then(function (dbCategory) {
                res.json(dbCategory);
            })
            .catch(function (err) {
                res.json(err);
            });
    });
    // Route for grabbing a specific class by id, populate it with it's note
    app.get("/classes/:id", function (req, res) {
        id = req.params.id;
        db.Class.find({ _id: id })
            .populate("Note")
            .then(function (dbClass) {
                res.json(dbClass);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    // Route for saving/updating an cat's associated class
    app.post("categorys/:id", function (req, res) {
        categoryId = req.params.id;
        db.Class.create(req.body)
            .then(function (dbClass) {
                return db.Class.findOneAndUpdate({ _id: categoryId }, { Class: dbClass._id }, { new: true })
            })
            .then(function (dbCategory) {
                res.json(dbCategory);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    // Route for saving/updating an class's associated Note
    app.post("/classes/:id", function (req, res) {
        classId = req.params.id;
        db.Note.create(req.body)
            .then(function (dbNote) {
                return db.class.findOneAndUpdate({ _id: classId }, { Note: dbNote._id }, { new: true })
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