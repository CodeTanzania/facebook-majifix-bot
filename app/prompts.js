
const i18n = require('i18n');
const API = require('./api');

exports.askPhoneNumber = async (context) => {
  const { locale } = context.state;
  await context.sendText(i18n.__({ phrase: 'textAddPhoneNum', locale }));
};

exports.askLocale = async (context) => {
  const { locale } = context.state;
  await context.sendText(i18n.__({ phrase: 'textSelectLanguage', locale }), {
    quick_replies: [
      {
        content_type: 'text',
        title: 'Swahili',
        payload: 'SW',
      },
      {
        content_type: 'text',
        title: 'English',
        payload: 'EN',
      },
    ],
  });
};

exports.askProblemService = async (context) => {
  const { locale } = context.state;
  const services = await API.getServices();
  const messengerServices = services.map(service => ({
    content_type: 'text',
    title: service.service_name,
    payload: service.service_code,
  }));
  await context.sendText(i18n.__({ phrase: 'textSelectProblemService', locale }), {
    quick_replies: messengerServices,
  });
};

exports.displayMainMenu = async (context) => {
  context.setState({
    dialog: {
      submitProblem: false,
      changeLanguage: false,
      changePhoneNumber: false,
    },
  });

  const { locale } = context.state;
  await context.sendButtonTemplate(i18n.__({ phrase: 'textBotWelcomeMsg', locale }), [
    {
      type: 'postback',
      title: i18n.__({ phrase: 'actionSubmitProblem', locale }),
      payload: 'SUBMIT_PROBLEM',
    },
    {
      type: 'postback',
      title: i18n.__({ phrase: 'actionChangePhoneNumber', locale }),
      payload: 'CHANGE_PHONE_NUMBER',
    },
    {
      type: 'postback',
      title: i18n.__({ phrase: 'actionChangeLanguage', locale }),
      payload: 'CHANGE_LANGUAGE',
    },
  ]);
};

exports.displayPhoneNumberConfirm = async (context) => {
  const { locale } = context.state;
  const quickConfirmMenu = i18n.__({
    phrase: 'menuQuickConfirm',
    locale,
  });
  // Modify menu items as per messenger requirement
  const messengerMenu = quickConfirmMenu.map((menu) => {
    menu.content_type = 'text'; // eslint-disable-line no-param-reassign
    return menu;
  });

  await context.sendText(i18n.__({ phrase: 'textConfirmPhone', locale }, context.state.phoneNumber), {
    quick_replies: messengerMenu,
  });
};
