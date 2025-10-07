const express = require('express');
const router = express.Router();

// Import route lain
const studentRouter = require('./student');
const bookRouter = require('./book');

// Gunakan route
router.use('/students', studentRouter);
router.use('/books', bookRouter);

module.exports = router;
