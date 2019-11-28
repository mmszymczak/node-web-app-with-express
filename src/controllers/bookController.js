const debug = require('debug')('app:bookController');
const mongoService = require('../services/mongoService');

function bookController(bookService, nav) {
  function getDetailsById(req, res) {
    const { id } = req.params;
    const isSignedIn = !!req.user;

    (async function query() {
      try {
        const book = await bookService.getBookById(id);
        const authors = (typeof book.authors.author === 'object' && book.authors.author.constructor === Array)
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
    }());
  }

  function addToLibrary(req, res) {
    const { id } = req.params;
    const isSignedIn = !!req.user;

    (async function query() {
      try {
        const col = await mongoService.getCollection('books');
        const book = await bookService.getBookById(id);
        const authors = (typeof book.authors.author === 'object' && book.authors.author.constructor === Array)
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
    }());
  }

  function toggleBookReadFlag(req, res) {
    const { id } = req.params;

    (async function update() {
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
    }());
  }

  function deleteFromLibrary(req, res) {
    const { id } = req.params;

    (async function remove() {
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
    }());
  }

  return {
    getDetailsById,
    addToLibrary,
    toggleBookReadFlag,
    deleteFromLibrary,
  };
}

module.exports = bookController;
