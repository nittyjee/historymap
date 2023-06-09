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
const validate = require('any_object_validator').recursiveSanitation;
const ObjectId = require('mongodb').ObjectId;

const encrypt = customModules('login').encrypt;
const decrypt = customModules('login').decrypt;

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

/**
 * @returns providers connection
 */
const providers = db().db(dbname).collection('providers');

exports.getLayers = async () => {
  const find = layerDatabase.find();
  const results = await find.toArray();
  return (results);
};

exports.getLayerById = async (layerIdInObj) => {
  const obId = new ObjectId(layerIdInObj);
  const find = layerDatabase.find({ _id: obId });
  const results = await find.toArray();
  return (results[0]);
};

exports.getStyleById = async (layerIdInObj) => {
  const obId = new ObjectId(layerIdInObj);
  const find = styleDatabase.find({ _id: obId });
  const results = await find.toArray();
  return (results[0]);
};

exports.saveLayer = async (layer) => {
  const cleanData = await validate(layer);
  const obId = new ObjectId(cleanData._id);
  delete cleanData.id;
  const query = { _id: obId };
  delete cleanData._id;
  const update = { $set: cleanData };
  const options = { upsert: true };
  const response = await layerDatabase.updateOne(query, update, options);
  return response;
};

exports.deleteLayer = (layerMongoID) => {
  const obId = new ObjectId(layerMongoID);
  return layerDatabase.deleteOne({ _id: obId }).then((result) => {
    return result;
  });
};

exports.getStyles = async () => {
  const find = styleDatabase.find();
  const results = await find.toArray();
  return (results);
};

exports.saveStyle = async (style) => {
  console.log(style);
  const cleanData = await validate(style);
  const obId = new ObjectId(cleanData._id);
  delete cleanData.id;
  const query = { _id: obId };
  delete cleanData._id;
  const update = { $set: cleanData };
  const options = { upsert: true };
  const response = await styleDatabase.updateOne(query, update, options);
  return response;
};

exports.getDutchLots = async () => {
  const find = dutchLots.find();
  const results = await find.toArray();
  return (results);
};

exports.getTaxLots = async () => {
  const find = taxLots.find();
  const results = await find.toArray();
  return (results);
};

exports.providerLogin = async (loginData) => {
  const submittedPassword = decrypt(loginData.password);
  const find = providers.find({ username: loginData.username });
  const provider = await find.toArray();
  let match;
  for (let i = 0; i < provider.length; i++) {
    if (decrypt(provider[i].password) === submittedPassword) {
      match = provider[i];
      break;
    }
    if (i === provider.length - 1) {
      match = false;
    }
  }
  return (match);
};
