const i18n = require('i18n');
const API = require('../api');
const { askPhoneNumber, askLocale, askProblemService, displayMainMenu } = require('../actions');

/**
 * Main handler of the conversation in this bot
 * This handler act as the default handler and last handler 
 * in the execution stack.
 * @param {object} context 
 * @param {function} next 
 */
const mainHandler = async (context, next) => {
  if (context.event.isPostback) {
    // Postback event
    const { payload } = context.event.postback;
    switch (payload) {
      case 'START':
        // welcome screen
        displayMainMenu(context);
        break;
      case 'CHANGE_LANGUAGE':
        //  change language selected
        context.setState({ dialog: { changeLanguage: true } });
        askLocale(context);
        break;
      case 'CHANGE_PHONE_NUMBER':
        // change phone number selected
        context.setState({ dialog: { changePhoneNumber: true }, askingPhoneNumber: true });
        askPhoneNumber(context);
        break;
      case 'SUBMIT_PROBLEM':
        context.setState({ dialog: { submitProblem: true }, askingProblemService: true });
        askProblemService(context);
        break;
    }
  } else {
    displayMainMenu(context);
  }
}


module.exports = mainHandler;