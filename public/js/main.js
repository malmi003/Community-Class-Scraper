// confirmed connected

$(document).ready(function() {
    // onclick function to start scrape
    // $(document).on("click", "#initiate-scrape-btn", function() {
    //     $.get("/scrapeList")
    //     .then(function(result) {

    //     });
    // });

    $.getJSON("/classes", function(data) {
        data.forEach((item, index) => {
                $("#category-list").append(`<li><button id="cat-btn-${index}"data-link="${item.link}">${item.title}<button></li>`)
            });
    })
});