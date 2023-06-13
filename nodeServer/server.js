require('dotenv').config();
/**
 * This is set up so you can simply drop in a .env file
 * should you want to publish to the internet.
 */

const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const port = process.env.PORT || 8080;
const serverIpAddress = process.env.IP || '127.0.0.1';
const express = require('express');
const app = express();
const path = require('path');

// Authentication
const MongoStore = require('connect-mongo');
const crypto = require('crypto');
const session = require('express-session');

global.customModules = (moduleName) => {
  const desiredMod = path.resolve(process.env.PWD + '/custom_modules/' + moduleName);
  return require(desiredMod);
};

const mongo = customModules('mongoConnect');
function generateRandomID (length) {
  function nodeCryptoRandomBytes (length) {
    const promise = new Promise((resolve, reject) => {
      length = length || 8;
      if (length > 80) {
        const err = new Error('randomBytes length can be more than 800 digits');
        throw err;
      }
      crypto.randomBytes(100, (err, buf) => {
        if (err) reject(err);
        const initialNumber = buf.toString('hex')
        const trimmed = initialNumber.slice(initialNumber.length - (length || 10));
        resolve(trimmed);
      });
    });
    return promise;
  }

  async function checkCollision () {
    const itemref = await nodeCryptoRandomBytes(length);
    /*
    const collision = await mongo.checkCollision({ itemref: itemref });
    if (collision === true) {
      return checkCollision();
    }
    */
    console.log(itemref);
    return itemref;
  }
  return checkCollision();
}

const initMongoSessionControl = () => {
  console.log('Establishing session control');
  const promise = new Promise(function (resolve, reject) {
    //  get connection
    const db = function () {
      const m = mongo.getDb();
      return m;
    };

    const mongoStoreOptions = {
      client: db(),
      ttl: 14 * 24 * 60 * 60 * 1000,
      collectionName: 'sessions'
    };

    const sessionOptions = {
      /*
        genid: () => {
          return generateRandomID (12); // use UUIDs for session IDs
        },
      */
      secret: process.env.sessionSecret,
      saveUninitialized: true, // don't create session until something stored,
      resave: true,
      store: MongoStore.create(mongoStoreOptions),
      cookie: { maxAge: 14 * 24 * 60 * 60 * 1000 }
    };

    if (app.get('env') === 'production') {
      app.set('trust proxy', 1); // trust first proxy
      sessionOptions.cookie.secure = true; // serve secure cookies
    }

    const intiatedSessions = session(sessionOptions);

    // app.use(intiatedSessions);

    resolve(intiatedSessions);
  });
  return promise;
};

const mountOtherMiddleWare = (expressSessions) => {
  app.use(compression());
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(expressSessions);
  app.set('trust proxy', 1);
  app.use('/static', express.static(__dirname + '/static'));
  app.use(favicon(path.join(__dirname, 'static', 'icon_32x32.ico')));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'pug');
  app.engine('html', require('pug').renderFile);
  // API Routes:
  require('./router')(app);
};

// Start app:
function startApp (port) {
  mongo.initDb()
    .then(initMongoSessionControl)
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
