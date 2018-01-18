const i18n = require('i18n');
const API = require('../api');

/**
 * Main handler of the conversation in this bot
 * This handler act as the default handler and last handler 
 * in the execution stack.
 * @param {object} context 
 * @param {function} next 
 */
const mainHandler = async (context, next) => {
  // Control reach here after passing to all other handlers
  if (context.event.isPostback) {
    // Postback event
    const { payload } = context.event.postback;
    switch (payload) {
      case 'START':
        // welcome screen
        welcomeDawasco(context);
        break;
      case 'CHANGE_LANGUAGE':
        //  change language selected
        chooseLanguage(context);
        break;
      case 'CHANGE_PHONE_NUMBER':
        // change phone number selected
        addPhoneNum(context);
        break;
      case 'SUBMIT_PROBLEM':
        displayServiceCategory(context);
        break;
    }
  } else {
    welcomeDawasco(context);
  }
}

/**
 * Send main menu command
 * @param {*} context 
 */
const welcomeDawasco = async (context) => {
  const { locale } = context.state;
  await context.sendButtonTemplate(i18n.__({ phrase: 'textBotWelcomeMsg', locale }), [
    {
      type: 'postback',
      title: i18n.__({ phrase: 'actionSubmitProblem', locale }),
      payload: 'SUBMIT_PROBLEM'
    },
    {
      type: 'postback',
      title: i18n.__({ phrase: 'actionChangePhoneNumber', locale }),
      payload: 'CHANGE_PHONE_NUMBER'
    },
    {
      type: 'postback',
      title: i18n.__({ phrase: 'actionChangeLanguage', locale }),
      payload: 'CHANGE_LANGUAGE'
    }
  ])
}

/**
 * Send select language command
 * @param {*} context 
 */
const chooseLanguage = async (context) => {
  context.setState({ dialog: { changeLanguage: true } });
  const { locale } = context.state;
  await context.sendText(i18n.__({ phrase: 'textSelectLanguage', locale }), {
    quick_replies: [
      {
        content_type: 'text',
        title: 'Swahili',
        payload: 'SW'
      },
      {
        content_type: 'text',
        title: 'English',
        payload: 'EN'
      }
    ]
  });
}

/**
 * Send add phone number command
 * @param {*} context 
 */
const addPhoneNum = async (context) => {
  context.setState({ dialog: { changePhoneNumber: true }, askingPhoneNumber: true });
  const { locale } = context.state;
  await context.sendText(i18n.__({ phrase: 'textAddPhoneNum', locale }));
}

/**
 * Initial step when submitting a problem
 * @param {*} context 
 */
const displayServiceCategory = async (context) => {
  context.setState({ dialog: { submitProblem: true }, askingProblemService: true });
  const { locale } = context.state;
  const services = await API.getServices();
  const messengerServices = services.map(service => {
    return {
      content_type: 'text',
      title: service.service_name,
      payload: service.service_code
    };
  });
  await context.sendText(i18n.__({ phrase: 'textSelectProblemService', locale }), {
    quick_replies: messengerServices
  });
}

module.exports = mainHandler;