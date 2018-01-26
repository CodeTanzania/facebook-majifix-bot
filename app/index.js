const {
  MessengerBot, middleware, RedisCacheStore, CacheBasedSessionStore,
} = require('bottender');
const { createServer } = require('bottender/express');
const logger = require('./winston');
const i18n = require('i18n');

const initHandler = require('./handlers/init');
const changeLocaleHandler = require('./handlers/changeLocale');
const changePhoneNumHandler = require('./handlers/changePhoneNum');
const submitProblemHandler = require('./handlers/submitProblem');
const mainHandler = require('./handlers/main');


// configure translation module
i18n.configure({
  directory: `${__dirname}/locales`,
  defaultLocale: 'sw',
});

// get app running port
const PORT = process.env.PORT || 5000;

// get messenger configuration
const config = require('./bottender.config.js').messenger;

// Initiate redis client, Bottender internal use ioredis
const cache = new RedisCacheStore({
  port: 6379,          // Redis port
  host: '127.0.0.1',   // Redis host
});

const bot = new MessengerBot({
  sessionStore: new CacheBasedSessionStore(cache),
  accessToken: config.accessToken,
  appSecret: config.appSecret,
});


// Initialize bot state
bot.setInitialState({
  dialog: {
    submitProblem: false,
    changeLanguage: false,
    changePhoneNumber: false,
  },
});

const { client } = bot.connector;

// set get started button payload
// https://goo.gl/4j2zkf
client.setGetStarted('START');

// add event handlers
bot.onEvent(middleware([
  initHandler,
  changeLocaleHandler,
  changePhoneNumHandler,
  submitProblemHandler,
  mainHandler]));

const server = createServer(bot, {
  verifyToken: config.verifyToken,
});

server.listen(PORT, () => {
  logger.info(`server is running on ${PORT} port`);
});
