const axios = require('axios');
const xml2js = require('xml2js');
const debug = require('debug')('app:goodreadsService');

const parser = new xml2js.Parser({ explicitArray: false });
const apkiKey = process.env.GR_API_KEY || '';
const domainUrl = 'https://www.goodreads.com';

function bookService() {
  function search(query) {
    return new Promise((resolve, reject) => {
      axios.get(`${domainUrl}/search/index.xml?key=${apkiKey}&q=${query}`)
        .then((response) => {
          parser.parseString(response.data, (err, result) => {
            if (err) {
              debug(err);
            } else {
              resolve(result.GoodreadsResponse.search.results.work);
            }
          });
        })
        .catch((err) => {
          debug('catch', err);
          reject(err);
        });
    });
  }

  function getBookById(id) {
    return new Promise((resolve, reject) => {
      axios.get(`${domainUrl}/book/show/${id}.xml?key=${apkiKey}`)
        .then((response) => {
          parser.parseString(response.data, (err, result) => {
            if (err) {
              debug(err);
            } else {
              resolve(result.GoodreadsResponse.book);
            }
          });
        })
        .catch((err) => {
          debug('catch', err);
          reject(err);
        });
    });
  }

  return {
    search,
    getBookById,
  };
}

module.exports = bookService();
