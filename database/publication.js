const mongoose=require("mongoose");

//Publication Schema
const PublicationSchema=mongoose.Schema({
    id: {
        type:Number,
        required:true
    },
    name: {
        type:String,
        required:true
    },
    books: {
        type:[String]
    }
});

//Create a publication model
const PublicationModel = mongoose.model("publication",PublicationSchema);

module.exports=PublicationModel;
