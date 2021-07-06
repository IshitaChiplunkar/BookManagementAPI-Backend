let books=[
    {
        ISBN:"12345ONE",
        title: "Getting started with MERN",
        authors: [1,2],
        language:"en",
        pubDate: "2021-07-07",
        numOfPage:225,
        category:["Fiction","Technology","Web development"],
        publication:1,
    },
    {
        ISBN:"12345TWO",
        title: "Getting started with Python",
        authors: [1],
        language:"en",
        pubDate: "2021-07-07",
        numOfPage:225,
        category:["Fiction","programming","Technology","Web development"],
        publication:2,
    },
];
let authors=[
    {
        id:1,
        name:"Siddhant",
        books:["12345ONE","12345TWO"],
    },
    {
        id:2,
        name:"Mandar",
        books:["12345ONE"],
    },
];

let publications=[
    {
        id:1,
        name:"Chakra",
        books:["12345ONE"],
    },
    {
        id:2,
        name:"Jaico",
        books:["12345TWO"],
    },
];

module.exports ={books,authors,publications};