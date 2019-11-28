const express = require('express');
const bookController = require('../controllers/bookController');
const bookService = require('../services/goodreadsService');

const bookRouter = express.Router();

function router(nav) {
  const {
    getDetailsById, addToLibrary, toggleBookReadFlag, deleteFromLibrary,
  } = bookController(bookService, nav);

  bookRouter.route('/:id')
    .get(getDetailsById)
    .post(addToLibrary)
    .put(toggleBookReadFlag)
    .delete(deleteFromLibrary);

  return bookRouter;
}

module.exports = router;
