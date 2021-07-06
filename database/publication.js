const mongoose=require("mongoose");

//Publication Schema
const PublicationSchema=mongoose.Schema({
    id: Number,
    name: String,
    books: [String],
});

//Create a publication model
const PublicationModels = mongoose.model("publication",PublicationSchema);

module.exports=PublicationModels;