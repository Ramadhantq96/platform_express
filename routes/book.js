const { PrismaClient } = require('../generated/prisma/client');

const router = require('express').Router();
const prisma = new PrismaClient();

// router.get('/', async(req, res) => {
//   try { 
//     const { search } = req.query;

//     const where = {};

//     if(search) {
//       where.OR = [
//         { title: { contains: search } },
//       ]
//     }

//     const books = await prisma.book.findMany({
//       where,
//     }); // SELECT * FROM book
//     return res.json({
//       status: true,
//       message: 'Berhasil mengambil data buku',
//       data: books
//     });
//   } catch (error) {
//     res.json({
//       status: false,
//       message: error.message
//     });
//   }
// });

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;

    const where = {};

    // Jika query "search" diisi, cari di beberapa kolom sekaligus
    if (search && search.trim() !== '') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { publisher: { contains: search, mode: 'insensitive' } },
      ];
    }

    const books = await prisma.book.findMany({
      where,
      orderBy: { id: 'desc' }, // urutkan dari data terbaru
    });

    return res.json({
      status: true,
      message: search
        ? `Hasil pencarian untuk "${search}"`
        : 'Berhasil mengambil semua data buku',
      data: books,
    });
  } catch (error) {
    res.json({
      status: false,
      message: error.message,
    });
  }
});

// GET - ambil satu buku berdasarkan ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const book = await prisma.book.findUnique({
      where: { id: Number(id) },
    });

    if (!book) {
      throw new Error('Buku tidak ditemukan');
    }

    return res.json({
      status: true,
      message: 'Berhasil mengambil data buku berdasarkan ID',
      data: book,
    });
  } catch (error) {
    res.json({
      status: false,
      message: error.message,
    });
  }
});

router.post('/', async(req, res) => {
  try {
    const { title, author, publisher, year } = req.body;

    const exist = await prisma.book.findFirst({
      where: {
        title: title
      }
    });

    if(exist) {
      throw new Error('Buku sudah terdaftar');
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        publisher,
        year: Number(year)
      }
    });
    return res.json({
      status: true,
      message: 'Berhasil menambahkan data buku',
      data: book
    });
  } catch (error) {
    res.json({
      status: false,
      message: error.message
    });
  }
});

// PUT - update data buku
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, publisher, year } = req.body;

    const exist = await prisma.book.findUnique({
      where: { id: Number(id) },
    });

    if (!exist) {
      throw new Error('Buku tidak ditemukan');
    }

    const updatedBook = await prisma.book.update({
      where: { id: Number(id) },
      data: {
        title,
        author,
        publisher,
        year: Number(year),
      },
    });

    return res.json({
      status: true,
      message: 'Berhasil memperbarui data buku',
      data: updatedBook,
    });
  } catch (error) {
    res.json({
      status: false,
      message: error.message,
    });
  }
});

// DELETE - hapus data buku
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const exist = await prisma.book.findUnique({
      where: { id: Number(id) },
    });

    if (!exist) {
      throw new Error('Buku tidak ditemukan');
    }

    await prisma.book.delete({
      where: { id: Number(id) },
    });

    return res.json({
      status: true,
      message: 'Berhasil menghapus data buku',
    });
  } catch (error) {
    res.json({
      status: false,
      message: error.message,
    });
  }
});

module.exports = router;

//tambahkan put(update + delete)
//kalau bisa searching dan paging