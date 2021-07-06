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
Description---> to get specific book based on  categorgy
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
Description---> to get list of books based on a author
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
Description---> to add new books
Access---> public
Parameters---> none
Method---> POST
*/
shapeAI.post("/book/new",async (req,res)=>{
    const {newBook}=req.body;
    BookModel.create(newBook);
    return res.json({message:"Book was added!"})
});



/*
Route---->    /book/update
Description---> update book details
Access---> public
Parameters---> isbn
Method---> PUT
*/
shapeAI.put("/book/update/:isbn",(req,res)=>{
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn){
            book.title=req.body.bookTitle;
            return;
        }
    });
    return res.json({books:database.books});
});


/*
Route---->    /book/author/update
Description---> update / add new author
Access---> public
Parameters---> isbn
Method---> PUT
*/
shapeAI.put("/book/author/update/:isbn",(req,res)=>{
    //update the book database
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn){
            return book.authors.push(req.body.newAuthor);
        }
    });
    //update the author database
    database.authors.forEach((author)=>{
        if(author.id===req.body.newAuthor){
            return author.books.push(req.params.isbn);
        }
    });
    return res.json({books:database.books,authors:database.authors,message:"New author was added"});
});


/*
Route---->    /book/delete
Description---> delete a book
Access---> public
Parameters---> isbn
Method---> DELETE
*/
shapeAI.delete("/book/delete/:isbn",(req,res)=>{
    const updatedBookDatabase=database.books.filter(
        (book)=>book.ISBN!==req.params.isbn
    );
    database.books=updatedBookDatabase;
    return res.json({books:database.books});
});


/*
Route---->    /book/delete/author
Description---> delete an author from a book
Access---> public
Parameters---> isbn,author
Method---> DELETE
*/
shapeAI.delete("/book/delete/author/:isbn/:authorId",(req,res)=>{
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn){
            const newAuthorList=book.authors.filter(
                (author)=>author!==parseInt(req.params.authorId)
            );
            book.authors=newAuthorList;
            return;
        };
    });
    //update the author database
    database.authors.forEach((author)=>{
        if(author.id===parseInt(req.params.authorId)){
            const newBookList=author.books.filter(
                (book)=>book!==req.params.isbn
            );
            author.books=newBookList;
            return;
        };
    });
return res.json({book:database.books,author:database.authors,message:"Author was deleted"});
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
Route---->    /auth/:id
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
Route---->    /author
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
shapeAI.put("/author/update/:id",(req,res)=>{
    database.authors.forEach((author)=>{
        if(author.id===parseInt(req.params.id)){
            author.name=req.body.authorName;
            return;
        }
    });
    return res.json({authors:database.authors});
});


/*
Route---->    /author/delete
Description---> delete an author
Access---> public
Parameters---> id
Method---> DELETE
*/
shapeAI.delete("/author/delete/:id",(req,res)=>{
    const updatedAuthorDatabase=database.authors.filter(
        (author)=>author.id!==parseInt(req.params.id)
    );
    database.authors=updatedAuthorDatabase;
    return res.json({authors:database.authors});
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
Route---->    /publications/:isbn
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
shapeAI.put("/publication/update/:id",(req,res)=>{
    database.publications.forEach((publication)=>{
        if(publication.id===parseInt(req.params.id)){
            publication.name=req.body.publicationName;
            return;
        }
    });
    return res.json({publication:database.publications});
});


/*
Route---->    /publication/update/book
Description---> update/add new book to a publication
Access---> public
Parameters---> isbn
Method---> PUT
*/
shapeAI.put("/publication/update/book/:isbn",(req,res)=>{
    //update the publication database
    database.publications.forEach((publication)=>{
        if(publication.id===req.body.pubId){
            return publication.books.push(req.params.isbn);
        }
    });
    //update book database
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn){
            book.publication=req.body.pubId;
            return;
        }
    });
    return res.json({books:database.books,publications:database.publications,message:"Successfully updated publication"});
});


/*
Route---->    /publication/delete/book
Description---> Delete a book from publication
Access---> public
Parameters---> isbn,pubId
Method---> DELETE
*/
shapeAI.delete("/publication/delete/book/:isbn/:pubId",(req,res)=>{
    //update publication database
    database.publications.forEach((publication)=>{
        if(publication.id===parseInt(req.params.pubId)){
            const newBooksList=publication.books.filter(
                (book)=>book!==req.params.isbn
            );
            publication.books=newBooksList;
            return;
        }
    });
    //update book database
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn){
            book.publication=0;   //means no publication available
            return;
        }
    });
    return res.json({books:database.books,publications:database.publications})
});


/*
Route---->    /publication/delete
Description---> delete a publication
Access---> public
Parameters---> id
Method---> DELETE
*/
shapeAI.delete("/publication/delete/:id",(req,res)=>{
    const updatedPublicationDatabase=database.publications.filter(
        (publication)=>publication.id!==parseInt(req.params.id)
    );
    database.publications=updatedPublicationDatabase;
    return res.json({publications:database.publications});
});

shapeAI.listen(3000,() => console.log("Server running!!"));
