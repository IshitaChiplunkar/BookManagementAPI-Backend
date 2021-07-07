const mongoose=require("mongoose");

//Creating a book schema
const BookSchema=mongoose.Schema({
    ISBN: {
        type:String,
        required:true,
        minLength:8,
        maxLength:10,
    }, //required
    title: {
        type:String,
        required:true
    },
    authors: {
        type:[Number]
    },
    language: {
        type:String,
        required:true
    },
    pubDate: {
        type:String,
        required:true
    },
    numOfPage: {
        type:Number,
        required:true
    },
    category: {
        type:[String],
    },
    publication: {
        type:Number,
        required:true
    }
});

//Create a book model
const BookModel = mongoose.model("books",BookSchema);

module.exports = BookModel;