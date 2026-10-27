// Load Express (the web framework) and create the app
const express = require("express");
const app = express();

// Load the book list from books.json into memory when the server starts
const fs = require("fs");
const text = fs.readFileSync("books.json", "utf8");
const books = JSON.parse(text);

// Let Express read JSON request bodies (used by POST and PUT via req.body)
app.use(express.json());

// GET / - simple welcome message
app.get("/", (req, res) => {
    res.send("Hello, my name is Liam!");
});

// GET /about - short description of the project
app.get("/about", (req, res) => {
    res.send("I am practicing using express.js to create a simple web server.");
});

// GET /api/books - return every book
app.get("/api/books", (req, res) => {
    res.json(books);
});

// GET /api/books/:id - return a single book by its id
app.get("/api/books/:id", (req, res) => {
    // URL params are strings, so convert to a number to compare with b.id
    const id = Number(req.params.id);
    const book = books.find((b) => b.id === id);
    if(!book)
    {
        res.status(404).json({ message: "Book not found" });
        return;
    }
    res.json(book);
});

// DELETE /api/books/:id - remove a book and save the change to books.json
app.delete("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);
    // findIndex returns -1 when no book matches
    const index = books.findIndex((b) => b.id === id);

    if(index === -1)
    {
        res.status(404).json({ message: "Book not found" });
        return;
    }

    // Remove 1 item at that position, then write the updated list back to disk
    books.splice(index, 1);
    fs.writeFileSync("books.json", JSON.stringify(books, null, 2));
    res.json({ message: "Book deleted successfully" });
});

// PUT /api/books/:id - update a book's title and/or author
app.put("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = books.findIndex((b) => b.id === id);

    if(index === -1)
    {
        res.status(404).json({ message: "Book not found" });
        return;
    }

    // Only change fields that were sent; otherwise keep the current value
    books[index].title = req.body.title || books[index].title;
    books[index].author = req.body.author || books[index].author;
    res.json(books);
    fs.writeFileSync("books.json", JSON.stringify(books, null, 2));
});

// POST /api/books - add a new book from the request body
app.post("/api/books", (req, res) => {
    const newBook = {
        id: books.length + 1,
        title: req.body.title,
        author: req.body.author
    };
    books.push(newBook);
    // Save to disk so the new book is still there after a restart
    fs.writeFileSync("books.json", JSON.stringify(books, null, 2));
    // 201 = "Created"
    res.status(201).json(newBook);
});

// Start the server on port 3000
app.listen(3000, (err) => {
    if(err) {
        console.log("Couldn't start: ", err.message);
        return;
    }
    console.log("Server is running at http://localhost:3000");
});
