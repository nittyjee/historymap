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
 * Makes a connection to the dutchLots++ connection
 * @returns dutchLots connection
 */
const dutchLots = db().db(dbname).collection('dutchLots++');

/**
 * Makes a connection to the taxLots connection
 * @returns taxLots connection
 */
const taxLots = db().db(dbname).collection('taxLots++');

exports.getDutchLots = () => {
  const promise = new Promise((resolve, reject) => {
    dutchLots.find({}).toArray((err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
  return promise;
};

exports.getTaxLots = () => {
  const promise = new Promise((resolve, reject) => {
    taxLots.find({}).toArray((err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
  return promise;
};
