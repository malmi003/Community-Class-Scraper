// Scraping tools - works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");
var mongoose = require("mongoose");

module.exports = function (app) {
    console.log();

    // Route for grabbing a specific Article by id, populate it with it's note
    // Route for saving/updating an Article's associated Note


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
    app.get("/classes", function(req, res) {
        db.class.find()
        .then(function(dbClass) {
            res.json(dbClass);
        })
        .catch(function(err) {
            res.json(err);
        })
    });


    // Log the results once you've looped through each of the elements found with cheerio
    // result.forEach((item, index) => {
    //     $("#category-list").append(`<li><button id="cat-btn-${index}"data-link="${item.mainLink}"><button></li>`)
    // });
    // console.log(results);

    // .then(function () {
    //     // * NEED TO ADD - on click of category
    //     // GET route to display selected categories on the page
    //     app.get("/scrapeList/:category", function (req, res) {
    //         let category = param.req.category;
    //         // let secondScrapeLink = $(this).attr("data-link")

    //         request("secondScrapeLink", function (error, response, html) {

    //             // Load the HTML into cheerio and save it to a variable
    //             // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    //             var $ = cheerio.load(html);

    //             // An empty array to save the data that we'll scrape
    //             var results = [];

    //             // Select each element in the HTML body from which you want information.
    //             $(".tier1").each(function (i, element) {
    //                 // console.log(element.children)
    //                 let mainLink = $(element).attr("href") + "&PageSize=50";
    //                 let category = $(element).text();

    //                 // Save these results in an object that we'll push into the results array we defined earlier
    //                 results.push({
    //                     mainLink: mainLink,
    //                     category: category,
    //                 });
    //             });

    //             // Log the results once you've looped through each of the elements found with cheerio
    //             console.log(results);
    //         })


    //     });
    // })
    //   now I want to scrape all the urls that came back for all the class options but only show the subcategory that's active (clicked on)


};