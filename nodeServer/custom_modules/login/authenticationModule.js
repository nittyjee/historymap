const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongo = customModules('mongoQueries');
const crypto = require('crypto');
const encryptionKey = process.env.encryptionKey; // Must be 256 bytes (32 characters)
const ivLength = 16; // For AES, this is always 16

exports.encrypt = (text) => {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

exports.decrypt = (text) => {
  const textParts = (text) ? text.split(':') : undefined;
  if (textParts.length < 2) {
    return textParts;
  }
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

passport.serializeUser((user, callback) => {
  callback(null, user);
});
passport.deserializeUser((user, callback) => {
  mongo.providerLogin({ username: user.username, password: user.password }).then((user) => {
    if (user) {
      return callback(null, user);
    } else {
      return callback(null, false);
    }
  });
});

passport.use('provider', new LocalStrategy(
  (username, password, done) => {
    mongo.providerLogin({ username, password: this.encrypt(password) }).then((user) => {
      if (user) {
        console.log(`User ${user.username} authenticated`);
        return done(null, user.username);
      } else {
        return done(null, false);
      }
    });
  }));

exports.passportInit = (app, session) => {
  app.use(passport.initialize());
  app.use(session);
};

// exports.providerStrategy = passport.authenticate('provider');
exports.providerStrategy = passport;
