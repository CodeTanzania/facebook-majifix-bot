const { MessengerBot, middleware } = require('bottender');
const { createServer } = require('bottender/express');
const logger = require('./winston');
const i18n = require('i18n');
const changeLocaleHandler = require('./handlers/changeLocale');
const mainHandler = require('./handlers/main');
const changePhoneNumHandler = require('./handlers/changePhoneNum');
const submitProblemHandler = require('./handlers/submitProblem');

// configure translation module
i18n.configure({
  directory: `${__dirname}/locales`,
  defaultLocale: 'sw',
});

// get app running port
const PORT = process.env.PORT || 5000;

// get messenger configuration
const config = require('./bottender.config.js').messenger;

const bot = new MessengerBot({
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
  locale: 'en',
});

const { client } = bot.connector;

// set get started button payload
// https://goo.gl/4j2zkf
client.setGetStarted('START');

// add event handlers
bot.onEvent(middleware([
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
