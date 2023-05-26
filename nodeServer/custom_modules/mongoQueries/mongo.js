/**
 * Mongo interface
 * @module Database interaction
 * @description Methods for database interaction
 */

const { ObjectID } = require('mongodb');

/**
 * Stock
 * @namespace getDataQueries
 * @description Simple data retrieval
 */

const dbname = process.env.dbname;
const validate = require('any_object_validator').recursiveSanitation;
const ObjectId = require('mongodb').ObjectID;

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

/**
 * @returns layerDatabase connection
 */
const layerDatabase = db().db(dbname).collection('layerData');

/**
 * @returns styleDatabase connection
 */
const styleDatabase = db().db(dbname).collection('styleData');

exports.getLayers = () => {
  const promise = new Promise((resolve, reject) => {
    layerDatabase.find({}).toArray((err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
  return promise;
};

exports.getLayerById = (layerIdInObj) => {
  const promise = new Promise((resolve, reject) => {
    layerDatabase.find({ _id: ObjectId(layerIdInObj) }).toArray((err, results) => {
      if (err) reject(err);
      resolve(results[0]);
    });
  });
  return promise;
};

exports.saveLayer = (layer) => {
  return (async () => {
    const cleanData = await validate(layer);
    delete cleanData.id;
    const query = { _id: ObjectId(cleanData._id) };
    delete cleanData._id;
    const update = { $set: cleanData };
    const options = { upsert: true };
    const response = await layerDatabase.updateOne(query, update, options);
    return response;
  })();
};

exports.deleteLayer = (layerMongoID) => {
  return layerDatabase.deleteOne({ _id: ObjectId(layerMongoID) }).then((result) => {
    return result;
  });
};

exports.getStyles = () => {
  const promise = new Promise((resolve, reject) => {
    styleDatabase.find({}).toArray((err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
  return promise;
};

exports.saveStyle = (style) => {
  return (async () => {
    const cleanData = await validate(style);
    delete cleanData.id;
    const query = { _id: ObjectId(cleanData._id) };
    delete cleanData._id;
    const update = { $set: cleanData };
    const options = { upsert: true };
    const response = await styleDatabase.updateOne(query, update, options);
    return response;
  })();
};

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
