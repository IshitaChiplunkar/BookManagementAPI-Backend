//Prefix :/book

//Initializing Express Router
const Router=require("express").Router();

//Database Models
const BookModel=require("../../database/book");
const AuthorModel=require("../../database/author");

//Book API
/*
Route---->    /
Description---> to get all books
Access---> public
Parameters---> none
Method---> GET
*/
Router.get("/",async (req,res) => {
    try{
        const getAllBooks= await BookModel.find();
        return res.json({books:getAllBooks});
    }catch(error){
        return res.json({error:error.message});
    }
});


/*
Route---->    /is
Description---> to get specific book based on ISBN
Access---> public
Parameters---> isbn
Method---> GET
*/
Router.get("/is/:isbn",async (req,res) =>{
    try{
        const getSpecificBook=await BookModel.findOne({
            ISBN:req.params.isbn
        });
        if(!getSpecificBook){
            return res.json({
            error:`No book found for the IBNS of ${req.params.isbn}`,
        });
        }
        return res.json({book:getSpecificBook});
    }catch(error){
        return res.json({error:error.message});
    }
});


/*
Route---->    /c
Description---> to get specific book based on categorgy
Access---> public
Parameters---> category
Method---> GET
*/
Router.get("/c/:category",async (req,res)=>{
    try{
        const getSpecificBooks= await BookModel.find({
            category:req.params.category,
        });
        if(!getSpecificBooks){
            return res.json({
                error:`No book found for the category of ${req.params.category}`,
             });
        }
        return res.json({books:getSpecificBooks});
    }catch(error){
        return res.json({error:error.message});
    }
});


/*
Route---->    /b
Description---> to get list of books based on a author id
Access---> public
Parameters---> authorId
Method---> GET
*/
Router.get("/b/:authorId",async (req,res) =>{
    try{ 
        const getSpecificBooks=await BookModel.find({
            authors:parseInt(req.params.authorId),
        });
        if(!getSpecificBooks){
            return res.json({
                error:`No book found for the author with id ${req.params.authorId}`,
             });
        }
        return res.json({books:getSpecificBooks});
    }catch(error){
        return res.json({error:error.message});
    }
});


/*
Route---->    /book/new
Description---> to add new book
Access---> public
Parameters---> none
Method---> POST
*/
Router.post("/new",async (req,res)=>{
    try{
        const {newBook}=req.body;
        await BookModel.create(newBook);
        return res.json({message:"New book was added!"});
    }catch(error){
        return res.json({error:error.message});
    }
});


/*
Route---->    /book/update
Description---> update book details
Access---> public
Parameters---> isbn
Method---> PUT
*/
Router.put("/update/:isbn", async (req,res)=>{
    try{
        const updatedBook= await BookModel.findOneAndUpdate(
            {
                ISBN:req.params.isbn
            },
            {
                title:req.body.bookTitle
            },
            {
                new:true     //to get updated data in postman
            }
        );
        return res.json({book:updatedBook});
    }catch(error){
            return res.json({error:error.message});
    }
});


/*
Route---->    /book/author/update
Description---> update / add new author
Access---> public
Parameters---> isbn
Method---> PUT
*/
Router.put("/author/update/:isbn", async (req,res)=>{
    //update the book database
    try{
        const updatedBook= await BookModel.findOneAndUpdate(
            {
                ISBN: req.params.isbn
            },
            {
                $addToSet:{
                    authors:req.body.newAuthor
                },
            },
            {
                new:true
            }
        );
    //update the author database
        const updatedAuthor= await AuthorModel.findOneAndUpdate(
            {
                id:req.body.newAuthor
            },
            {
                $addToSet:{
                    books:req.params.isbn
                },
            },
            {
                new:true
            }
        );
        return res.json({
            books:updatedBook,
            authors:updatedAuthor,
            message:"New author was added to the book"
        });
    }catch(error){
        return res.json({error:error.message});
    }
});


/*
Route---->    /book/delete
Description---> delete a book
Access---> public
Parameters---> isbn
Method---> DELETE
*/
Router.delete("/delete/:isbn",async(req,res)=>{
    try{
        const updatedBookDatabase=await BookModel.findOneAndDelete(
            {
                ISBN:req.params.isbn
            }
        );
        return res.json({books:updatedBookDatabase});
    }catch(error){
        return res.json({error:error.message});
    }
});


/*
Route---->    /book/delete/author
Description---> delete an author from a book
Access---> public
Parameters---> isbn,author
Method---> DELETE
*/
Router.delete("/delete/author/:isbn/:authorId",async(req,res)=>{
    try{
        //delete an author from a book
        const updatedBook= await BookModel.findOneAndUpdate(
            {
                ISBN:req.params.isbn
            },
            {
                $pull:{
                    authors:parseInt(req.params.authorId)
                }
            },
            {
                new:true
            }
        );
        //update the author database
        const updatedAuthor= await AuthorModel.findOneAndUpdate(
            {
                id:parseInt(req.params.authorId)
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
        return res.json({
            book:updatedBook,
            author:updatedAuthor,
            message:"Author was deleted from the book"
        });
    }catch(error){
        return res.json({error:error.message});
    }
});

module.exports = Router;
