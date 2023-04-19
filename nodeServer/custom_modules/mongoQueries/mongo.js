/**
 * Mongo interface
 * @module Database interaction
 * @description Methods for database interaction
 */

/**
 * Stock
 * @namespace getDataQueries
 * @description Simple data retrieval
 */

const dbname = process.env.dbname;

/**
 * Makes a connetion to the DB pool
 * @returns A DB connection from the pool
 */
const db = () => {
  const mongoConnect = customModules('mongoConnect');
  return mongoConnect.getDb();
};

/**
 * Makes a connection to the dutchLots connection
 * @returns dutchLots connection
 */
const dutchLots = db().db(dbname).collection('dutchLots++');

/**
  * Get post titles
  * @summary Call this with no parameters to get all post titles.
  * @description Returns all the titles of all the blog posts. Posts aren't
  * expelicitly linked, rather they are dynamically linked via their title.
  * @returns {Promise<Array>} Resolves an array with all the blog post titles.
  * @memberof blog
  * @see backendEventDelegation
  */
exports.getDutchLots = () => {
  const promise = new Promise((resolve, reject) => {
    dutchLots.find({}).toArray((err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
  return promise;
};
