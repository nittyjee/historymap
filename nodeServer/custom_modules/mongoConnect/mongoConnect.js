const mongopass = process.env.mongopass;
const dbname = process.env.dbname;
const dbusername = process.env.dbusername;
const urlSt = process.env.mongoDBUrl;
let url;

(() => {
  url = urlSt;
  url = url.replaceAll('${mongopass}', mongopass);
  url = url.replaceAll('${dbusername}', dbusername);
  url = url.replaceAll('${dbname}', dbname);
})();

const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
let _db;

module.exports = {
  getDb,
  initDb
};

async function initDb() {
  _db = await client.connect();
  console.log(`Connected to ${dbname} database`);
}

/*
const eventName = "connectionPoolCreated";
client.on(eventName, (event) =>
  console.log("\nreceived event:\n", event)
);

}*/

function getDb() {
  assert.ok(_db, `Db has not been initialized. Please call init first.`);
  return _db;
}
