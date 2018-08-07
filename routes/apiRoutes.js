let request = require("request");
var cheerio = require("cheerio");

module.exports = function (app) {

    // Route for getting all Articles from the db
    // Route for grabbing a specific Article by id, populate it with it's note
    // Route for saving/updating an Article's associated Note
    // Make a request call to grab the HTML body from the site of your choice


    // A GET route for scraping the community ed website
    app.get("/scrapeList", function (req, res) {
        request("https://www.ed2go.com/mplscommed/", function(error, response, html) {

            // Load the HTML into cheerio and save it to a variable
            // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
            var $ = cheerio.load(html);
          
            // An empty array to save the data that we'll scrape
            var results = [];
          
            // Select each element in the HTML body from which you want information.
            $(".tier1").each(function(i, element) {
                // console.log(element.children)
              let mainLink = $(element).attr("href") + "&PageSize=50";
              let mainTitle = $(element).text();
          
              // Save these results in an object that we'll push into the results array we defined earlier
              results.push({
                mainLink: mainLink,
                mainTitle: mainTitle,
              });
            });
          
            // Log the results once you've looped through each of the elements found with cheerio
            console.log(results);
          });
        //   now I want to scrape all the urls that came back for all the class options but only show the subcategory that's active (clicked on)
    });

};