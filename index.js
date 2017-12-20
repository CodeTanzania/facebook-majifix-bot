const { MessengerBot } = require('bottender');
const { createServer } = require('bottender/express');
const PORT = process.env.PORT || 5000;

const config = require('./bottender.config.js').messenger;

const bot = new MessengerBot({
  accessToken: config.accessToken,
  appSecret: config.appSecret,
});

bot.onEvent(async context => {
  await context.sendText('Hello World');
});

const server = createServer(bot, {
  verifyToken: config.verifyToken
});

server.listen(PORT, () => {
  console.log(`server is running on ${PORT} port`);
});
