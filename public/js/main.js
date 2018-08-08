// confirmed connected

$(document).ready(function () {
    // onclick function to start scrape
    // $(document).on("click", "#initiate-scrape-btn", function() {
    //     $.get("/scrapeList")
    //     .then(function(result) {

    //     });
    // });

    $.getJSON("/classes", function (data) {
        data.forEach((item, index) => {
            $("#category-list").append(`<li>
                <button id="cat-btn-${index}"data-link="${item.link}">${item.title}</button>

                <button id="class-btn-${index}" class="class-scrape" data-link="${item.link}">Scrape for the newest classes</button></li>`)
        });
    });

    $(document).on("click", ".class-scrape", function () {
        let url = {
            url: $(this).data("link")
        };
        $.post("/scrapeClasses/", url)
            .then(function (result) {
                console.log(result)
            });
    });

});