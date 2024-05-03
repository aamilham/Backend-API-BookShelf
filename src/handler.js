const { nanoid } = require("nanoid");
const books = require("./books");

const saveBookHandler = (request, h) => {
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

  if (!name) {
    return h
      .response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = readPage === pageCount;

  const book = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  books.push(book);

  const isSuccess = books.find((book) => book.id === id);

  if (isSuccess) {
    return h
      .response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          bookId: id,
        },
      })
      .code(201);
  }

  const response = h
    .response({
      status: "error",
      message: "Buku gagal ditambahkan",
    })
    .code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = books;

  if (name) {
    const searchName = name.toLowerCase();
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(searchName)
    );
  }

  if (reading !== undefined) {
    const isReading = reading === "1";
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
  }

  if (finished !== undefined) {
    const isFinished = finished === "1";
    filteredBooks = filteredBooks.filter(
      (book) => book.finished === isFinished
    );
  }

  return h
    .response({
      status: "success",
      data: {
        books: filteredBooks.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    })
    .code(200);
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return h
      .response({
        status: "fail",
        message: "Buku tidak ditemukan",
      })
      .code(404);
  }

  return h
    .response({
      status: "success",
      data: {
        book: book,
      },
    })
    .code(200);
};

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

  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) {
    return h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
      })
      .code(404);
  }

  if (!name) {
    return h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
  }

  if (bookIndex !== -1) {
    books[bookIndex] = {
      ...books[bookIndex],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    };

    return h
      .response({
        status: "success",
        message: "Buku berhasil diperbarui",
      })
      .code(200);
  }
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) {
    return h
      .response({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan",
      })
      .code(404);
  }

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);

    return h
      .response({
        status: "success",
        message: "Buku berhasil dihapus",
      })
      .code(200);
  }
};

module.exports = {
  saveBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
