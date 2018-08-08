// confirmed connected

$(document).ready(function () {
    // pull categories/class from DB to display right away
    $.getJSON("/categorys", function (data) {
        data.forEach((item, index) => {
            // console.log(item)
            $("#category-list").append(`<li>
                <button id="cat-btn-${index}"data-link="${item.link}">${item.title}</button>

                <button id="class-btn-${index}" class="class-scrape" data-link="${item.link}" data-dbid="${item._id}">Scrape for the newest classes</button></li>`)
        });
    });

    // onclick function to (redo) category scrape
    $(document).on("click", "#initiate-scrape-btn", function () {
        $.ajax({
            method: "GET",
            url: "/scrapeCategory"
        }).then(function () {
            $.getJSON("/categorys", function (data) {
                data.forEach((item, index) => {
                    // console.log(item)
                    $("#category-list").append(`<li>
                                <button id="cat-btn-${index}"data-link="${item.link}">${item.title}</button>
                
                                <button id="class-btn-${index}" class="class-scrape" data-link="${item.link}" data-dbid="${item._id}">Scrape for the newest classes</button></li>`);
                });
            });
        })
    });

    $(document).on("click", ".class-scrape", function () {
        let data = {
            url: $(this).data("link"),
            id: $(this).data("dbid")
        };
        $.post("/scrapeClasses/", data)
            .then(function (data) {
                console.log(data);
            })
            .catch(function (err) {
                console.log(err);
            });
    });

});