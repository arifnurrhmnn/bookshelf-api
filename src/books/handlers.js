const { nanoid } = require("nanoid");
const books = require("./books");

// ADD BOOK
const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Init book.
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };

  // Validate input.
  if (!name) {
    const response = h
      .response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      })
      .code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h
      .response({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
    return response;
  }

  // Add book.
  books.push(newBook);

  // Check if book was added.
  const isSuccess = books.filter((book) => book.id === id).length === 1;

  // if success to add book.
  if (isSuccess) {
    const response = h
      .response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          bookId: id,
        },
      })
      .code(201);
    return response;
  }

  // If failed to add book.
  const response = h
    .response({
      status: "error",
      message: "Buku gagal ditambahkan",
    })
    .code(500);
  return response;
};

// GET BOOKS
const getBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = books;

  // Filter by name.
  if (name) {
    filteredBooks = filteredBooks.filter(
      (book) => book.name.toLowerCase().includes(name.toLowerCase()) !== false
    );
  }

  // Filter by reading.
  if (reading) {
    filteredBooks = filteredBooks.filter(
      (book) => Number(book.reading) === Number(reading)
    );
  }

  // Filter by finished.
  if (finished) {
    filteredBooks = filteredBooks.filter(
      (book) => Number(book.finished) === Number(finished)
    );
  }

  // list book
  const listBook = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  const response = h
    .response({
      status: "success",
      data: {
        books: listBook,
      },
    })
    .code(200);
  return response;
};

// GET BOOK BY ID
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.find((book) => book.id === bookId);

  // If success to find book
  if (book) {
    const response = h
      .response({
        status: "success",
        data: {
          book,
        },
      })
      .code(200);
    return response;
  }

  // If failed to find book
  const response = h
    .response({
      status: "fail",
      message: "Buku tidak ditemukan",
    })
    .code(404);
  return response;
};

// EDIT BOOK BY ID
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  // Find book.
  const index = books.findIndex((book) => book.id === bookId);

  // Validate input.
  if (!name) {
    const response = h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      })
      .code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h
      .response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
    return response;
  }

  if (index !== -1) {
    // Update book.
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h
      .response({
        status: "success",
        message: "Buku berhasil diperbarui",
      })
      .code(200);
    return response;
  }

  // If book not found.
  const response = h
    .response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    })
    .code(404);
  return response;
};

// DELETE BOOK BY ID
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // Find book.
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    // Delete book.
    books.splice(index, 1);

    const response = h
      .response({
        status: "success",
        message: "Buku berhasil dihapus",
      })
      .code(200);
    return response;
  }

  // If book not found.
  const response = h
    .response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    })
    .code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
