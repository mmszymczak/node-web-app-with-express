const debug = require('debug')('app:bookController');
const mongoService = require('../services/mongoService');

function bookController(bookService, nav) {
  function idMiddlewear(req, res, next) {
    if (!req.params.id) {
      res.status(400);
      res.send('Book id is required.');
    } else {
      next();
    }
  }

  async function getDetailsById(req, res) {
    const { id } = req.params;
    const isSignedIn = !!req.user;

    try {
      const book = await bookService.getBookById(id);
      const authors = Array.isArray(book.authors.author)
        ? book.authors.author.map((a) => a.name)
        : [book.authors.author.name];
      book.authors = authors.join(', ');

      res.render(
        'bookView',
        {
          title: 'Library',
          nav,
          book,
          isSignedIn,
          isAdded: false,
        },
      );
    } catch (err) {
      debug(err.stack);
    }
  }

  async function addToLibrary(req, res) {
    const { id } = req.params;
    const isSignedIn = !!req.user;

    try {
      const col = await mongoService.getCollection('books');
      const book = await bookService.getBookById(id);
      const authors = Array.isArray(book.authors.author)
        ? book.authors.author.map((a) => a.name)
        : [book.authors.author.name];
      book.authors = authors.join(', ');

      const preparedBook = {
        read: false,
        image_url: book.image_url,
        id: book.id,
        title: book.title,
        num_pages: book.num_pages,
        authors: book.authors,
        publication_day: book.publication_day,
        publication_month: book.publication_month,
        publication_year: book.publication_year,
        publisher: book.publisher,
        average_rating: book.average_rating,
        description: book.description,
      };

      await col.insertOne(preparedBook)
        .then((result) => debug(`Successfully inserted with _id: ${result.insertedId}`))
        .catch((err) => debug(`Failed to insert: ${err}`));

      res.status(201);
      res.render(
        'bookView',
        {
          title: 'Library',
          nav,
          book,
          isSignedIn,
          isAdded: true,
        },
      );
    } catch (err) {
      debug(err.stack);
    }

    mongoService.closeConnection();
  }

  async function toggleBookReadFlag(req, res) {
    const { id } = req.params;

    try {
      const col = await mongoService.getCollection('books');
      const book = await col.findOne({ id });
      const upadtedBook = { ...book, read: !book.read };
      // eslint-disable-next-line quote-props
      await col.updateOne({ id }, { '$set': upadtedBook })
        .then(() => debug(`Updated item with id ${id}.`))
        .catch((err) => debug(`Update failed with error: ${err}`));

      res.redirect('/auth/profile/books');
    } catch (err) {
      debug(err.stack);
    }
  }

  async function deleteFromLibrary(req, res) {
    const { id } = req.params;

    try {
      const col = await mongoService.getCollection('books');

      await col.deleteOne({ id })
        .then(() => debug(`Deleted item with id ${id}.`))
        .catch((err) => debug(`Delete failed with error: ${err}`));

      res.redirect('/auth/profile/books');
    } catch (err) {
      debug(err.stack);
    }

    mongoService.closeConnection();
  }

  return {
    idMiddlewear,
    getDetailsById,
    addToLibrary,
    toggleBookReadFlag,
    deleteFromLibrary,
  };
}

module.exports = bookController;
