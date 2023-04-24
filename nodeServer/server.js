require('dotenv').config();
/**
 * This is set up so you can simply drop in a .env file
 * should you want to publish to the internet.
 */

const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
const serverIpAddress = process.env.IP || '127.0.0.1';
const express = require('express');
const app = express();

global.customModules = (moduleName) => {
  const path = require('path');
  const desiredMod = path.resolve(process.env.PWD + '/custom_modules/' + moduleName);
  return require(desiredMod);
};

const mongo = customModules('mongoConnect');
const initDb = mongo.initDb;

const initMongo = () => {
  const promise = new Promise(function (resolve, reject) {
    initDb(function (err) {
      if (!err) {
        console.log('DB init');
        resolve();
      } else {
        reject(err);
      }
    });
  });
  return promise;
};

const mountOtherMiddleWare = () => {
  app.use(compression());
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.set('trust proxy', 1);
  app.use('/static', express.static(__dirname + '/static'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'pug');
  app.engine('html', require('pug').renderFile);
  // API Routes:
  require('./router')(app);
};

// Start app:
function startApp (port) {
  initMongo()
    // .then(initMongoSessionControl)
    .then(mountOtherMiddleWare)
    .then(() => {
      app.listen(port, serverIpAddress, function () {
        console.log(`Listening on ${port}, ip address ${serverIpAddress}`);
      });
    }).catch((err) => {
      console.warn(err);
    });
}

module.exports = { startApp };
