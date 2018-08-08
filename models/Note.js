let mongoose = require("mongoose");

// schema constructor
let Schema = mongoose.Schema;

let NoteSchema = new Schema({
    title: String,
    body: String
});

// create model from above using Mongoose's model method
let Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
