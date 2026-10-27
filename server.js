const express = require("express");
const app = express();
const fs = require("fs");
const text = fs.readFileSync("books.json", "utf8");
const books = JSON.parse(text);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello, my name is Liam!");
});

app.get("/about", (req, res) => {
    res.send("I am practicing using express.js to create a simple web server.");
});

app.get("/api/books", (req, res) => {
    res.json(books);
});

app.get("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const book = books.find((b) => b.id === id);
    if(!book)
    {
        res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
});

app.delete("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = books.findIndex((b) => b.id === id);

    if(index === -1)
    {
        res.status(404).json({ message: "Book not found" });
    }

    books.splice(index, 1);
    fs.writeFileSync("books.json", JSON.stringify(books, null, 2));
    res.json({ message: "Book deleted successfully" });
});

app.put("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = books.findIndex((b) => b.id === id);

    if(index === -1)
    {
        res.status(404).json({ message: "Book not found" });
    }

    books[index].title = req.body.title || books[index].title;
    books[index].author = req.body.author || books[index].author;
    res.json(books);
    fs.writeFileSync("books.json", JSON.stringify(books, null, 2));
});

app.post("/api/books", (req, res) => {
    const newBook = {
        id: books.length + 1,
        title: req.body.title,
        author: req.body.author
    };
    books.push(newBook);
    fs.writeFileSync("books.json", JSON.stringify(books, null, 2));
    res.status(201).json(newBook);
});

app.listen(3000, (err) => {
    if(err) {
        console.log("Couldn't start: ", err.message);
        return;
    }
    console.log("Server is running at http://localhost:3000");
});