require('dotenv').config();
const serverPort = process.env.PORT || 8088;
require('./server.js').startApp(serverPort);
