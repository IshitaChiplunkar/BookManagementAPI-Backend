//Prefix :/author

//Initializing Express Router
const Router=require("express").Router();

//Database Models
const AuthorModel=require("../../database/author");


//Author API
/*
Route---->    /author
Description---> get all authors
Access---> public
Parameters---> none
Method---> GET
*/
Router.get("/",async (req,res) => {
    try{
        const getAllAuthors= await AuthorModel.find();
        return res.json({authors:getAllAuthors});
    }catch(error){
        return res.json({error:error.message});
    }
});


/*
Route---->    /auth
Description---> to get specific author based on their id
Access---> public
Parameters---> id
Method---> GET
*/
Router.get("/auth/:id",async (req,res) =>{
    try{
        const getSpecificAuthor=await AuthorModel.findOne({
            id:parseInt(req.params.id),
        });
        if(!getSpecificAuthor){
            return res.json({
                error:`No specific author found with id ${req.params.id}`,
        });
        }
        return res.json({author:getSpecificAuthor});
    }catch(error){
        return res.json({error:error.message});
    }
});


/*
Route---->    /authors
Description---> to get list of all authors based on book
Access---> public
Parameters---> isbn
Method---> GET
*/
Router.get("/:isbn",async (req,res) =>{
    try{
        const getSpecificAuthors=await AuthorModel.find({
            books:req.params.isbn,
        });
        if(!getSpecificAuthors){
            return res.json({
                error:`No author found for the book ${req.params.isbn}`,
            });
        }
        return res.json({authors:getSpecificAuthors});
    }catch(error){
        return res.json({error:error.message});
    }
});


/*
Route---->    /author/new
Description---> to add new author
Access---> public
Parameters---> none
Method---> POST
*/
Router.post("/new",async (req,res)=>{
    try{
        const {newAuthor}=req.body;
        await AuthorModel.create(newAuthor);
        return res.json({message:"Author was added!"})
    }catch(error){
        return res.json({error:error.message});
    }
});


/*
Route---->    /author/update
Description---> update author details
Access---> public
Parameters---> id
Method---> PUT
*/
Router.put("/update/:id", async (req,res)=>{
    try{
        const updatedAuthor= await AuthorModel.findOneAndUpdate(
            {
                id:parseInt(req.params.id)
            },
            {
                name:req.body.authorName
            },
            {
                new:true     //to get updated data in postman
            }
        );
        return res.json({author:updatedAuthor});
    }catch(error){
        return res.json({error:error.message});
    }
});


/*
Route---->    /author/delete
Description---> delete an author
Access---> public
Parameters---> id
Method---> DELETE
*/
Router.delete("/delete/:id",async(req,res)=>{
    try{
        const updatedAuthorDatabase=await AuthorModel.findOneAndDelete(
            {
                id:parseInt(req.params.id)
            }
        );
        return res.json({authors:updatedAuthorDatabase});
    }catch(error){
        return res.json({error:error.message});
    }
});

module.exports = Router;
