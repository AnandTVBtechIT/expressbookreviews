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

const axios = require('axios');

// Task 10: Get all books using async/await
public_users.get('/async/books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    res.status(200).json({ task: "Task 10", data: response.data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Task 11: Get book by ISBN using async/await
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${req.params.isbn}`);
    res.status(200).json({ task: "Task 11", data: response.data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching book by ISBN", error: error.message });
  }
});

// Task 12: Get books by author using async/await
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(req.params.author)}`);
    res.status(200).json({ task: "Task 12", data: response.data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

// Task 13: Get books by title using async/await
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(req.params.title)}`);
    res.status(200).json({ task: "Task 13", data: response.data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
});
