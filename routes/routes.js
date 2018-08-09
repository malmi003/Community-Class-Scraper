// Scraping tools - works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");
var mongoose = require("mongoose");

module.exports = function (app) {
    // A GET route for scraping the community ed website categories
    app.get("/scrapeCategory", function (req, res) {

        axios.get("https://www.ed2go.com/mplscommed/").then(function (response) {

            let $ = cheerio.load(response.data);

            $(".tier1").each(function (i, element) {

                let result = {};

                result.title = element.children[0].data;
                result.link = element.attribs.href + "&PageSize=10";
                db.Category.find({ title: result.title })
                    .then(function (dbCategory) {
                        // console.log(dbCategory)
                        if (dbCategory == []) {
                            db.Category.create(result)
                                .then(function (dbCategory) {
                                    console.log(dbCategory);
                                })
                                .catch(function (err) {
                                    res.json(err);
                                });
                        }
                    })
                    .catch(function (err) {
                        return res.json(err);
                    });

            });

            res.send("Scrape Complete")
        });
    });


    // A GET route for scraping the community ed website classes
    app.post("/scrapeClasses/", function (req, res) {
        let url = req.body.url;
        let id = req.body.id
        axios.get(url).then(function (response) {

            let $ = cheerio.load(response.data);

            $(".description").each(function (i, element) {

                let result = {};

                result.title = element.children[1].children[1].children[0].data;
                result.link = element.children[1].children[1].attribs.href;

                // insert if stmt to check if class already exists, if it doesn't -add
                db.Class.find({ link: result.link })
                    .then(function (dbClass) {
                        // console.log(dbClass)
                        if (dbClass.length == 0) {
                            console.log("in the if")
                            db.Class.create(result)
                                .then(function (dbClass) {
                                    return db.Category.findOneAndUpdate({ _id: id }, { $push: { classes: dbClass._id } }, { new: true })
                                })
                                .catch(function (err) {
                                    res.json(err);
                                });
                        }
                    })
                    .catch(function (err) {
                        res.json(err);
                    });
                    res.send("Class Scrape Complete")
            });
        });
    });
    // Route for getting all cats from the db
    app.get("/categorys", function (req, res) {
        db.Category.find()
            .then(function (dbCategory) {
                res.json(dbCategory);
            })
            .catch(function (err) {
                res.json(err);
            })
    });
    // Route for getting all classes from the db
    app.get("/classes/:id", function (req, res) {
        db.Class.find({ _id: req.params.id })
            .then(function (dbClass) {
                res.json(dbClass);
            })
            .catch(function (err) {
                res.json(err);
            })
    });

    // Route for grabbing a specific category by id, populate it with it's class
    app.get("/categorys/:id", function (req, res) {
        id = req.params.id;
        db.Category.find({ _id: id })
            .populate("classes")
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