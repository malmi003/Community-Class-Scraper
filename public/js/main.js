function renderPage() {
    // pull categories/class from DB to display right away
    $("#category-list").empty();
    $.getJSON("/categorys", function (data) {
        data.forEach((item, index) => {
            // console.log(item)
            $("#category-list").append(`<li>
                <a class="btn btn-info cat-btn" data-toggle="collapse" href="#cl-${item._id}" role="button" aria-expanded="false"><h4 id="cat-btn-${index}" data-link="${item.link}">${item.title}<span class="small"> click to expand</span></h4></a></li>
                
                <ul class="class-list collapse" id="cl-${item._id}"><button id="class-btn-${index}" class="class-scrape btn btn-outline-warning btn-sm" data-link="${item.link}" data-dbid="${item._id}">Scrape for the newest classes</button><div id="ccl-${item._id}" class="card-columns"><div></ul>`)

        });
    }).then(function (data) {
        data.forEach(item => {
            item.classes.forEach((newItem, index) => {
                $.get("/classes/" + newItem, function (data) {
                    if (data[0].saved == true) {
                        $("#ccl-" + item._id).append(
                            `<div class="card border-info mb-3" style="width: 18rem">
                            <h5 class="card-header text-white bg-info">${data[0].title}</h5>
                          <div class="card-body">
                           <p class="card-text">${data[0].description}</p>
                           <button class="unsave-btn btn btn-danger btn-block" data-id="${newItem}">unsave</button>
                         </div>
                         </div>`
                        )
                    } else {
                        $("#ccl-" + item._id).append(
                            `<div class="card border-info mb-3" style="width: 18rem;">
                                <h5 class="card-header text-white bg-info">${data[0].title}</h5>
                          <div class="card-body">
                           <p class="card-text">${data[0].description}</p>
                           <button class="save-btn btn btn-success btn-block" data-id="${newItem}">save</button>
                         </div>
                         </div>`
                        )
                    }
                })

            })

        })
    })
}


function getSavedClasses() {
    $.ajax({
        method: "GET",
        url: "/savedClasses/"
    }).then(function (data) {
        console.log(data)
        $("#saved-list").html("<h3 class='text-center'>Saved Classes</h3><hr>")
        data.forEach(item => {
            let noteList = [];
            item.notes.forEach(newItem => {
                noteList.push(`
                <li class="card border-info mb-3" style="width: 18rem">
                <h5 class="card-header text-white bg-info">${newItem.title}</h5>
                <div class="card-body">
                  
                 <p class="card-text">${newItem.body}</p>
                 <button class="delete-note btn btn-danger btn-block" data-id="${newItem._id}">delete note</button></li>
               </div>
               </li>`
                )
            })
            let newNoteList = noteList.join("");

            $("#saved-list").append(
                `<h4 class="text-center">${item.title}</h4> 
                <p class="text-center">${item.description}</p>

                <button data-id="${item._id}" class="show-notes btn btn-success" data-toggle="collapse" href="#collapse-${item._id}" aria-expanded="true" aria-controls="collapse-${item._id}">hide/show notes</button>
                <ul id="collapse-${item._id}" class="collapse show">${newNoteList}</ul>

                <br>
                <button data-id="${item._id}" class="add-notes btn btn-success" data-toggle="modal" data-target="#note-form-${item._id}">add note</button>

                <form id="note-form-${item._id}" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Add a note to ${item.title}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="form-group modal-body">
                                <input placeholder="title" class="title form-control" data-id="${item._id}" id="title${item._id}"></input>
                                <textarea placeholder="body" id="note${item._id}" class="note form-control" data-id="${item._id}" rows="3"></textarea>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-primary add-btn" data-id="${item._id}">add note</button>
                                 
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </form>
                
                <hr>`)
        });
    });
};

$(document).ready(function () {

    renderPage();

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
                                <h4 id="cat-btn-${index}"data-link="${item.link}">${item.title}</h4></li>

                                <ul class="class-list" id="cl-${item._id}"><button id="class-btn-${index}" class="class-scrape" data-link="${item.link}" data-dbid="${item._id}">Scrape for the newest classes</button><div id="ccl-${item._id}" class="card-group"><div></ul>`
                    );
                });
            })
                .then(function () {
                    console.log("reload")
                    renderPage()
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
                renderPage()
            })
            .catch(function (err) {
                console.log(err);
            });
    });

    $(document).on("click", ".add-btn", function (event) {
        console.log("noting");
        $("body").removeClass("modal-open");
        $(".modal-backdrop").removeClass("show");
        $(".modal-backdrop").removeClass("fade");
        $(".modal-backdrop").removeClass("modal-backdrop");
        // event.preventDefault();
        // When you click the savenote button
        // Grab the id associated with the article from the submit button
        var thisId = $(this).attr("data-id");
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
                getSavedClasses();
            });
        // Run a POST request to change the note, using what's entered in the inputs
    });


    $(document).on("click", ".save-btn", function () {
        // console.log("working")
        let thisId = $(this).attr("data-id");
        $(this).attr("class", "unsave-btn btn btn-danger btn-block");
        $(this).html("unsave");
        $.ajax({
            method: "POST",
            url: "/savedClasses/" + thisId
        }).then(function (data) {
            console.log(data);
        })
    });

    $(document).on("click", ".unsave-btn", function () {
        let thisId = $(this).attr("data-id");
        $(this).attr("class", "save-btn btn btn-success btn-block");
        $(this).html("save");
        $.ajax({
            method: "POST",
            url: "/unsavedClasses/" + thisId
        }).then(function (data) {
            console.log(data);
            // location.reload();


        })
    });

    // show saved classes only
    $(document).on("click", "#view-saved", function () {
        $("#cat-class-list").addClass("d-none");
        $("#saved-list").removeClass("d-none");
        $("#view-saved").addClass("d-none");
        $("#view-main-page").removeClass("d-none");

        getSavedClasses()
    });

    $(document).on("click", "#view-main-page", function () {
        $("#view-saved").removeClass("d-none");
        $("#view-main-page").addClass("d-none");
        $("#cat-class-list").removeClass("d-none");
        $("#saved-list").addClass("d-none");

    });

    $(document).on("click", ".delete-note", function () {
        let thisId = $(this).attr("data-id");
        $.ajax({
            method: "POST",
            url: "/deleteNote/" + thisId
        }).then(function (data) {
            console.log(data);

            getSavedClasses();

        })
    });

});