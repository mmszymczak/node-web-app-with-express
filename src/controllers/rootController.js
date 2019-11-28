const debug = require('debug')('app:rootController');

function rootController(bookService, nav) {
  function initialize(req, res) {
    let searchResult = {};

    (async function search() {
      try {
        if (req.query && req.query.query) {
          searchResult = await bookService.search(req.query.query);
        }

        res.render(
          'index',
          {
            title: 'Library',
            nav,
            searchResult,
          },
        );
      } catch (err) {
        debug(err.stack);
      }
    }());
  }

  return {
    initialize,
  };
}

module.exports = rootController;
