const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password are required" });
  if (!isValid(username)) return res.status(409).json({ message: "User already exists" });
  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered" });
});

public_users.get('/', (req, res) => {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) return res.status(200).json(book);
  else return res.status(404).json({ message: "Book not found" });
});

public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const filtered = Object.values(books).filter(book => book.author === author);
  if (filtered.length > 0) return res.status(200).json(filtered);
  else return res.status(404).json({ message: "No books found for this author" });
});

public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const filtered = Object.values(books).filter(book => book.title === title);
  if (filtered.length > 0) return res.status(200).json(filtered);
  else return res.status(404).json({ message: "No books found with this title" });
});

public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) return res.status(200).json(book.reviews);
  else return res.status(404).json({ message: "No reviews found for this book" });
});

module.exports.general = public_users;
