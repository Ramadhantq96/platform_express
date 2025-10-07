const express = require('express');
const fs = require('fs');
const router = express.Router();

const filePath = 'books.json';

// Baca data dari JSON
function getBooks() {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

// Simpan data ke JSON
function saveBooks(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// GET semua buku
router.get('/', (req, res) => {
  const books = getBooks();
  res.json(books);
});

// GET satu buku berdasarkan ID
router.get('/:id', (req, res) => {
  const books = getBooks();
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: 'Buku tidak ditemukan' });
  res.json(book);
});

// POST buku baru
router.post('/', (req, res) => {
  const books = getBooks();
  const newBook = {
    id: books.length ? books[books.length - 1].id + 1 : 1,
    judul: req.body.judul,
    author: req.body.author,
    publikasi: req.body.publikasi
  };

  books.push(newBook);
  saveBooks(books);
  res.status(201).json(newBook);
});

// PUT update buku
router.put('/:id', (req, res) => {
  const books = getBooks();
  const index = books.findIndex(b => b.id === parseInt(req.params.id));

  if (index === -1) return res.status(404).json({ message: 'Buku tidak ditemukan' });

  books[index] = { ...books[index], ...req.body };
  saveBooks(books);
  res.json(books[index]);
});

// DELETE buku
router.delete('/:id', (req, res) => {
  const books = getBooks();
  const filtered = books.filter(b => b.id !== parseInt(req.params.id));

  if (filtered.length === books.length)
    return res.status(404).json({ message: 'Buku tidak ditemukan' });

  saveBooks(filtered);
  res.json({ message: 'Buku berhasil dihapus' });
});

module.exports = router;
