let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let CategorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    class: {
        type: Schema.Types.ObjectId,
        ref: "Class"
    }
});

// create model from above schema using Mongoose's model method
let Category = mongoose.model("Category", CategorySchema);

module.exports = Category;