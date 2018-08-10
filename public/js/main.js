// confirmed connected

$(document).ready(function () {
    // pull categories/class from DB to display right away
    $.getJSON("/categorys", function (data) {
        data.forEach((item, index) => {
            // console.log(item)
            $("#category-list").append(`<li>
                <h4 id="cat-btn-${index}"data-link="${item.link}">${item.title}</h4>

                <button id="class-btn-${index}" class="class-scrape" data-link="${item.link}" data-dbid="${item._id}">Scrape for the newest classes</button></li>
                
                <ul class="class-list" id="cl-${item._id}"></ul>`)
        });
    }).then(function (data) {
        data.forEach(item => {
            item.classes.forEach((newItem, index) => {
                $.get("/classes/" + newItem, function (data) {
                    // console.log(newItem)
                    $("#cl-" + item._id).append(`<li>${data[0].title} <button class="add-btn" data-id="${newItem}">add note</button><input class="title" data-id="${newItem}" id="title${newItem}"></input><input id="note${newItem}" class="note" data-id="${newItem}"></input></li>`)
                })
            })

        })
    })

    // onclick function to (redo) category scrape
    $(document).on("click", "#initiate-scrape-btn", function () {
        $.ajax({
            method: "GET",
            url: "/scrapeCategory"
        }).then(function () {
            $.getJSON("/categorys", function (data) {
                data.forEach((item, index) => {
                    // console.log(item)
                    // $("#category-list").empty();
                    $("#category-list").append(`<li>
                                <h4 id="cat-btn-${index}"data-link="${item.link}">${item.title}</h4>
                
                                <button id="class-btn-${index}" class="class-scrape" data-link="${item.link}" data-dbid="${item._id}">Scrape for the newest classes</button></li>

                                <ul class="class-list" id="cl-${item._id}"></ul>`
                    );
                });
            })
                .then(function () {
                    console.log("reload")
                    location.reload();
                });
        });
    });

    $(document).on("click", ".class-scrape", function () {
        // console.log("working")
        let data = {
            url: $(this).data("link"),
            id: $(this).data("dbid")
        };
        $.post("/scrapeClasses/", data)
            .then(function (data) {
                console.log(data);
            })
            .then(function () {
                console.log("reload")
                location.reload();
            })
            .catch(function (err) {
                console.log(err);
            });
    });

    $(document).on("click", ".add-btn", function () {
        console.log("noting");
        // When you click the savenote button
            // Grab the id associated with the article from the submit button
            var thisId = $(this).attr("data-id");

            // Run a POST request to change the note, using what's entered in the inputs
            $.ajax({
                method: "POST",
                url: "/classes/" + thisId,
                data: {
                    // Value taken from title input
                    title: $("#title" + thisId).val(),
                    // Value taken from note textarea
                    body: $("#note" + thisId).val(),
                }
            })
                // With that done
                .then(function (data) {
                    // Log the response
                    console.log(data);
                    // Empty the notes section
                    $("#title" + thisId).empty();
                    $("#note" + thisId).empty();
                });

            // Also, remove the values entered in the input and textarea for note entry
            $("#titleinput").val("");
            $("#bodyinput").val("");
        });

});