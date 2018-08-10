// confirmed connected

$(document).ready(function () {
    // pull categories/class from DB to display right away
    $.getJSON("/categorys", function (data) {
        data.forEach((item, index) => {
            // console.log(item)
            $("#category-list").append(`<li>
                <a class="btn btn-info cat-btn" data-toggle="collapse" href="#cl-${item._id}" role="button" aria-expanded="false"><h4 id="cat-btn-${index}" data-link="${item.link}">${item.title}<span class="small"> click to expand</span></h4></a>

                <button id="class-btn-${index}" class="class-scrape" data-link="${item.link}" data-dbid="${item._id}">Scrape for the newest classes</button></li>
                
                <ul class="class-list collapse" id="cl-${item._id}"></ul>`)
        });
    }).then(function (data) {
        data.forEach(item => {
            item.classes.forEach((newItem, index) => {
                $.get("/classes/" + newItem, function (data) {
                    if (data[0].saved == true) {
                        $("#cl-" + item._id).append(`<li>${data[0].title} <button class="unsave-btn" data-id="${newItem}">unsave</button></li>`)
                    } else {
                        $("#cl-" + item._id).append(`<li>${data[0].title} <button class="save-btn" data-id="${newItem}">save</button></li>`)
                    }
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
                $.ajax({
                    method: "GET",
                    url: "/savedClasses/"
                }).then(function (data) {
                    console.log(data)
                    $("#saved-list").html("<h3>Saved Classes</h3> <button id='view-main-page'>Back to class list<button>")
                    data.forEach(item => {
                        let noteList = [];
                        item.notes.forEach(item => {
                            noteList.push(`<li><span class="note-title-display">${item.title}</span>: ${item.body}
                        <button class="delete-note" data-id="${item._id}">delete note</button><button class="update-note" data-id="${item._id}">update note</button></li>`)
                        })
                        let newNoteList = noteList.join("");

                        $("#saved-list").append(
                            `<li><h4>${item.title}</h4> <button class="add-btn" data-id="${item._id}">add note</button><input class="title" data-id="${item._id}" id="title${item._id}"></input><input id="note${item._id}" class="note" data-id="${item._id}"></input></li><h5>Class Notes</h5><ul>${newNoteList}</ul>`)
                    })
                })

            });
    });

    $(document).on("click", ".save-btn", function () {
        // console.log("working")
        let thisId = $(this).attr("data-id");
        $.ajax({
            method: "POST",
            url: "/savedClasses/" + thisId
        }).then(function (data) {
            console.log(data);
            location.reload();
        })
    });

    $(document).on("click", ".unsave-btn", function () {
        let thisId = $(this).attr("data-id");
        $.ajax({
            method: "POST",
            url: "/unsavedClasses/" + thisId
        }).then(function (data) {
            console.log(data);
            location.reload();

        })
    });

    // show saved classes only
    $(document).on("click", "#view-saved", function () {
        $("#cat-class-list").addClass("d-none");
        $("#saved-list").removeClass("d-none");
        $.ajax({
            method: "GET",
            url: "/savedClasses/"
        }).then(function (data) {
            console.log(data)
            $("#saved-list").html("<h3>Saved Classes</h3> <button id='view-main-page'>Back to class list<button>")
            data.forEach(item => {
                let noteList = [];
                item.notes.forEach(newItem => {
                    noteList.push(`<li><span class="note-title-display">${newItem.title}</span>: ${newItem.body}
                    <button class="delete-note" data-id="${newItem._id}">delete note</button><button class="update-note" data-class="${item._id}" data-id="${newItem._id}">update note</button></li>`)
                })
                let newNoteList = noteList.join("");

                $("#saved-list").append(
                    `<li><h4>${item.title}</h4> <button class="add-btn" data-id="${item._id}">add note</button><input class="title" data-id="${item._id}" id="title${item._id}"></input><input id="note${item._id}" class="note" data-id="${item._id}"></input></li><h5>Class Notes</h5><ul>${newNoteList}</ul>`)
            })

        })
    });

    $(document).on("click", "#view-main-page", function () {
        location.reload();
    });

    $(document).on("click", ".delete-note", function () {
        let thisId = $(this).attr("data-id");
        $.ajax({
            method: "POST",
            url: "/deleteNote/" + thisId
        }).then(function (data) {
            console.log(data);

            $.ajax({
                method: "GET",
                url: "/savedClasses/"
            }).then(function (data) {
                console.log(data)
                $("#saved-list").html("<h3>Saved Classes</h3> <button id='view-main-page'>Back to class list<button>")
                data.forEach(item => {
                    let noteList = [];
                    item.notes.forEach(item => {
                        noteList.push(`<li><span class="note-title-display">${item.title}</span>: ${item.body}
                    <button class="delete-note" data-id="${item._id}">delete note</button><button class="update-note" data-id="${item._id}">update note - not functional</button></li>`)
                    })
                    let newNoteList = noteList.join("");

                    $("#saved-list").append(
                        `<li><h4>${item.title}</h4> <button class="add-btn" data-id="${item._id}">add note</button><input class="title" data-id="${item._id}" id="title${item._id}"></input><input id="note${item._id}" class="note" data-id="${item._id}"></input></li><h5>Class Notes</h5><ul>${newNoteList}</ul>`)
                })

            })

        })
    });

    // CURRENTLY DOES NOT WORK!!
    $(document).on("click", ".update-note", function () {
        let thisId = $(this).attr("data-id");
        let classId = $(this).attr("class-id");
        $.ajax({
            method: "GET",
            url: "/notes/" + thisId
        }).then(function (dbNote) {
            console.log(dbNote);
            $(".title #data-id"+classId).val(dbNote.title);
            $(".note #data-id"+classId).val(dbNote.body);

        })
            // .then(function (data) {
            //     return db.Note.findOneAndUpdate({ _id: categoryId }, { classes: dbClass._id }, { new: true })
            // })
        // rerender saved classes
        // $.ajax({
        //     method: "GET",
        //     url: "/savedClasses/"
        // }).then(function (data) {
        //     console.log(data)
        //     $("#saved-list").html("<h3>Saved Classes</h3> <button id='view-main-page'>Back to class list<button>")
        //     data.forEach(item => {
        //         let noteList = [];
        //         item.notes.forEach(item => {
        //             noteList.push(`<li><span class="note-title-display">${item.title}</span>: ${item.body}
        //                 <button class="delete-note" data-id="${item._id}">delete note</button><button class="update-note" data-id="${item._id}">update note</button></li>`)
        //         })
        //         let newNoteList = noteList.join("");

        //         $("#saved-list").append(
        //             `<li><h4>${item.title}</h4> <button class="add-btn" data-id="${item._id}">add note</button><input class="title" data-id="${item._id}" id="title${item._id}"></input><input id="note${item._id}" class="note" data-id="${item._id}"></input></li><h5>Class Notes</h5><ul>${newNoteList}</ul>`)
        //     })
        // })

    });
});