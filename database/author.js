const mongoose=require("mongoose");

//Author Schema
const AuthorSchema=mongoose.Schema({
    id: Number,
    name: String,
    books: [String],
});

//Create an author model
const AuthorModels = mongoose.model("authors",AuthorSchema);

module.exports=AuthorModels;