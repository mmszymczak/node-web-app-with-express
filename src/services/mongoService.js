const { MongoClient } = require('mongodb');
const debug = require('debug')('app:mongo');

const url = 'mongodb://localhost:27017';
const dbName = 'MSLibrary';

let client;
let db;

async function connect() {
  try {
    client = await MongoClient.connect(url);
    db = client.db(dbName);
    Promise.resolve();
  } catch (err) {
    debug(err.stack);
    Promise.reject(err);
  }
}

async function getCollection(name) {
  await connect();
  const collection = await db.collection(name);
  return collection;
}

function closeConnection() {
  client.close();
}

module.exports = {
  getCollection,
  closeConnection,
};
