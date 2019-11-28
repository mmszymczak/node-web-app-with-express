const express = require('express');
const rootController = require('../controllers/rootController');
const bookService = require('../services/goodreadsService');

const rootRouter = express.Router();

function router(nav) {
  const { initialize } = rootController(bookService, nav);

  rootRouter.route('/')
    .get(initialize);

  return rootRouter;
}

module.exports = router;
