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
    description: {
        type: String,
    },
    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Note"
        }
    ],
    saved: false
});

// create model from above schema using Mongoose's model method
let Class = mongoose.model("Class", ClassSchema);

module.exports = Class;