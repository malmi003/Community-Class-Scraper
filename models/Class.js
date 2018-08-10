let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let ClassSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    note: [
        {
            type: Schema.Types.ObjectId,
            ref: "Note"
        }
    ]
});

// create model from above schema using Mongoose's model method
let Class = mongoose.model("Class", ClassSchema);

module.exports = Class;