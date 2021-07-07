//Prefix :/publication

//Initializing Express Router
const Router=require("express").Router();

//Database Models
const PublicationModel=require("../../database/publication");
const BookModel=require("../../database/book");


//Publication API
/*
Route---->    /publication
Description---> to get all publications
Access---> public
Parameters---> none
Method---> GET
*/
Router.get("/",async (req,res) => {
    try{
        const getAllPublications= await PublicationModel.find();
        return res.json({publications:getAllPublications});
    }catch(error){
        return res.json({error:error.message});
    }
});


/*
Route---->    /pub
Description---> to get specific publication based on their id
Access---> public
Parameters---> isbn
Method---> GET
*/
Router.get("/pub/:id",async (req,res) =>{
    try{
        const getSpecificPublication=await PublicationModel.findOne({
            id:parseInt(req.params.id),
        });
        if(!getSpecificPublication){
            return res.json({
                error:`No specific publication found with id ${req.params.id}`,
        });
        }
        return res.json({publication:getSpecificPublication});
    }catch(error){
        return res.json({error:error.message});
    }
});


/*
Route---->    /publication
Description---> to get list of all publications based on a book
Access---> public
Parameters---> isbn
Method---> GET
*/
Router.get("/:isbn",async (req,res) =>{
    try{
        const getSpecificPublications=await PublicationModel.findOne({
            books:req.params.isbn,
        });
        if(!getSpecificPublications){
            return res.json({
                error:`No publication found for the book ${req.params.isbn}`,
            });
        }
        return res.json({publications:getSpecificPublications});
    }catch(error){
        return res.json({error:error.message});
    }
});


/*
Route---->    /publication/new
Description---> to add new publication
Access---> public
Parameters---> none
Method---> POST
*/
Router.post("/new",async (req,res)=>{
    try{
        const {newPublication}=req.body;
        await PublicationModel.create(newPublication);
        return res.json({message:"Publication was added!"})
    }catch(error){
        return res.json({error:error.message});
    }
});


/*
Route---->    /publication/update
Description---> update publication details
Access---> public
Parameters---> id
Method---> PUT
*/
Router.put("/update/:id", async (req,res)=>{
    try{
        const updatedPublication= await PublicationModel.findOneAndUpdate(
            {
                id:parseInt(req.params.id)
            },
            {
                name:req.body.publicationName
            },
            {
                new:true     //to get updated data in postman
            }
        );
        return res.json({publication:updatedPublication});
    }catch(error){
        return res.json({error:error.message});
    }
});


/*
Route---->    /publication/update/book
Description---> update/add new book to a publication
Access---> public
Parameters---> isbn
Method---> PUT
*/
Router.put("/update/book/:id", async (req,res)=>{
    try{
        //update the publication database
        const updatedPublication= await PublicationModel.findOneAndUpdate(
            {
                id: parseInt(req.params.id)
            },
            {
                $addToSet:{
                    books:req.body.newBook
                },
            },
            {
                new:true
            }
        );
        //update the book database
        const updatedBook= await BookModel.findOneAndUpdate(
            {
                ISBN:req.body.newBook
            },
            {
                publication:parseInt(req.params.id)   
            },
            {
                new:true
            }
        );
        return res.json({
            publications:updatedPublication,
            books:updatedBook,
            message:"New book was added to the publication"
        });
    }catch(error){
        return res.json({error:error.message});
    }
});


/*
Route---->    /publication/delete/book
Description---> Delete a book from publication
Access---> public
Parameters---> isbn,pubId
Method---> DELETE
*/
Router.delete("/delete/book/:isbn/:pubId",async(req,res)=>{
    try{
        //delete a book from publication
        const updatedPublication= await PublicationModel.findOneAndUpdate(
            {
                id:parseInt(req.params.pubId)
            },
            {
                $pull:{
                    books:req.params.isbn
                }
            },
            {
                new:true
            }
        );
        //update the book database
        const updatedBook= await BookModel.findOneAndUpdate(
            {
                ISBN:req.params.isbn
            },
            {
                publication:0
            },
            {
                new:true
            }
        );
        return res.json({
            publication:updatedPublication,
            book:updatedBook,
            message:"Book was deleted from the publication"
        });
    }catch(error){
        return res.json({error:error.message});
    }
});


/*
Route---->    /publication/delete
Description---> delete a publication
Access---> public
Parameters---> id
Method---> DELETE
*/
Router.delete("/delete/:id",async(req,res)=>{
    try{
        const updatedPublicationDatabase=await PublicationModel.findOneAndDelete(
            {
                id:parseInt(req.params.id)
            }
        );
        return res.json({publications:updatedPublicationDatabase});
    }catch(error){
        return res.json({error:error.message});
    }
});

module.exports = Router;