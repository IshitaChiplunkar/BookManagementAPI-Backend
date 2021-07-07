require("dotenv").config();


// Framework
const express=require("express");
const mongoose=require("mongoose");

// Database
const database=require("./database/index");

//Models
const BookModel=require("./database/book");
const AuthorModel=require("./database/author");
const PublicationModel=require("./database/publication");

// Initializing express
const shapeAI= express();

// Configurations
shapeAI.use(express.json());

//Establish database connection
mongoose
    .connect(process.env.MONGO_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }
).then(()=>console.log("Connection extablished!!!"));



//1.Books
/*
Route---->    /
Description---> to get all books
Access---> public
Parameters---> none
Method---> GET
*/
shapeAI.get("/",async (req,res) => {
    const getAllBooks= await BookModel.find();
    return res.json({books:getAllBooks});
});


/*
Route---->    /is
Description---> to get specific book based on ISBN
Access---> public
Parameters---> isbn
Method---> GET
*/
shapeAI.get("/is/:isbn",async (req,res) =>{
    const getSpecificBook=await BookModel.findOne({ISBN:req.params.isbn});
    if(!getSpecificBook){
        return res.json({
            error:`No book found for the IBNS of ${req.params.isbn}`,
        });
    }
    return res.json({book:getSpecificBook});
});


/*
Route---->    /c
Description---> to get specific book based on categorgy
Access---> public
Parameters---> category
Method---> GET
*/
shapeAI.get("/c/:category",async (req,res)=>{
    const getSpecificBooks= await BookModel.findOne({
        category:req.params.category,
    });
    if(!getSpecificBooks){
        return res.json({
            error:`No book found for the category of ${req.params.category}`,
        });
    }
    return res.json({books:getSpecificBooks});
});


/*
Route---->    /b
Description---> to get list of books based on a author id
Access---> public
Parameters---> authorId
Method---> GET
*/
shapeAI.get("/b/:authorId",async (req,res) =>{
    const getSpecificBooks=await BookModel.findOne({
        authors:parseInt(req.params.authorId),
    });
    if(!getSpecificBooks){
        return res.json({
            error:`No book found for the author with id ${req.params.authorId}`,
    });
    }
    return res.json({books:getSpecificBooks});
});


/*
Route---->    /book/new
Description---> to add new book
Access---> public
Parameters---> none
Method---> POST
*/
shapeAI.post("/book/new",async (req,res)=>{
    const {newBook}=req.body;
    BookModel.create(newBook);
    return res.json({message:"New book was added!"})
});



/*
Route---->    /book/update
Description---> update book details
Access---> public
Parameters---> isbn
Method---> PUT
*/
shapeAI.put("/book/update/:isbn", async (req,res)=>{
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
});


/*
Route---->    /book/author/update
Description---> update / add new author
Access---> public
Parameters---> isbn
Method---> PUT
*/
shapeAI.put("/book/author/update/:isbn", async (req,res)=>{
    //update the book database
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
});


/*
Route---->    /book/delete
Description---> delete a book
Access---> public
Parameters---> isbn
Method---> DELETE
*/
shapeAI.delete("/book/delete/:isbn",async(req,res)=>{
    const updatedBookDatabase=await BookModel.findOneAndDelete(
        {
            ISBN:req.params.isbn
        }
    );
    return res.json({books:updatedBookDatabase});
});


/*
Route---->    /book/delete/author
Description---> delete an author from a book
Access---> public
Parameters---> isbn,author
Method---> DELETE
*/
shapeAI.delete("/book/delete/author/:isbn/:authorId",async(req,res)=>{
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
});



//Author
/*
Route---->    /authors
Description---> get all authors
Access---> public
Parameters---> none
Method---> GET
*/
shapeAI.get("/authors",async (req,res) => {
    const getAllAuthors= await AuthorModel.find();
    return res.json({authors:getAllAuthors});
});


/*
Route---->    /auth
Description---> to get specific author based on their id
Access---> public
Parameters---> id
Method---> GET
*/
shapeAI.get("/auth/:id",async (req,res) =>{
    const getSpecificAuthor=await AuthorModel.findOne({
        id:parseInt(req.params.id),
    });
    if(!getSpecificAuthor){
        return res.json({
            error:`No specific author found with id ${req.params.id}`,
    });
    }
    return res.json({author:getSpecificAuthor});
});


/*
Route---->    /authors
Description---> to get list of all authors based on book
Access---> public
Parameters---> isbn
Method---> GET
*/
shapeAI.get("/authors/:isbn",async (req,res) =>{
    const getSpecificAuthors=await AuthorModel.findOne({
        books:req.params.isbn,
    });
    if(!getSpecificAuthors){
        return res.json({
            error:`No author found for the book ${req.params.isbn}`,
        });
    }
    return res.json({authors:getSpecificAuthors});
});


/*
Route---->    /author/new
Description---> to add new author
Access---> public
Parameters---> none
Method---> POST
*/
shapeAI.post("/author/new",async (req,res)=>{
    const {newAuthor}=req.body;
    AuthorModel.create(newAuthor);
    return res.json({message:"Author was added!"})
});


/*
Route---->    /author/update
Description---> update author details
Access---> public
Parameters---> id
Method---> PUT
*/
shapeAI.put("/author/update/:id", async (req,res)=>{
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
});


/*
Route---->    /author/delete
Description---> delete an author
Access---> public
Parameters---> id
Method---> DELETE
*/
shapeAI.delete("/author/delete/:id",async(req,res)=>{
    const updatedAuthorDatabase=await AuthorModel.findOneAndDelete(
        {
            id:parseInt(req.params.id)
        }
    );
    return res.json({authors:updatedAuthorDatabase});
});



//Publications
/*
Route---->    /publication
Description---> to get all publications
Access---> public
Parameters---> none
Method---> GET
*/
shapeAI.get("/publications",async (req,res) => {
    const getAllPublications= await PublicationModel.find();
    return res.json({publications:getAllPublications});
});


/*
Route---->    /pub
Description---> to get specific publication based on their id
Access---> public
Parameters---> isbn
Method---> GET
*/
shapeAI.get("/pub/:id",async (req,res) =>{
    const getSpecificPublication=await AuthorModel.findOne({
        id:parseInt(req.params.id),
    });
    if(!getSpecificPublication){
        return res.json({
            error:`No specific publication found with id ${req.params.id}`,
    });
    }
    return res.json({publication:getSpecificPublication});
});


/*
Route---->    /publication
Description---> to get list of all publications based on a book
Access---> public
Parameters---> isbn
Method---> GET
*/
shapeAI.get("/publication/:isbn",async (req,res) =>{
    const getSpecificPublications=await PublicationModel.findOne({
        books:req.params.isbn,
    });
    if(!getSpecificPublications){
        return res.json({
            error:`No publication found for the book ${req.params.isbn}`,
        });
    }
    return res.json({publications:getSpecificPublications});
});



/*
Route---->    /publication/new
Description---> to add new publication
Access---> public
Parameters---> none
Method---> POST
*/
shapeAI.post("/publication/new",async (req,res)=>{
    const {newPublication}=req.body;
    PublicationModel.create(newPublication);
    return res.json({message:"Publication was added!"})
});


/*
Route---->    /publication/update
Description---> update publication details
Access---> public
Parameters---> id
Method---> PUT
*/
shapeAI.put("/publication/update/:id", async (req,res)=>{
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
});



/*
Route---->    /publication/update/book
Description---> update/add new book to a publication
Access---> public
Parameters---> isbn
Method---> PUT
*/
shapeAI.put("/publication/update/book/:id", async (req,res)=>{
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
});


/*
Route---->    /publication/delete/book
Description---> Delete a book from publication
Access---> public
Parameters---> isbn,pubId
Method---> DELETE
*/
shapeAI.delete("/publication/delete/book/:isbn/:pubId",async(req,res)=>{
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
});


/*
Route---->    /publication/delete
Description---> delete a publication
Access---> public
Parameters---> id
Method---> DELETE
*/
shapeAI.delete("/publication/delete/:id",async(req,res)=>{
    const updatedPublicationDatabase=await PublicationModel.findOneAndDelete(
        {
            id:parseInt(req.params.id)
        }
    );
    return res.json({publications:updatedPublicationDatabase});
});


shapeAI.listen(3000,() => console.log("Server running!!"));
