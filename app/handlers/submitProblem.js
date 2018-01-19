
const i18n = require('i18n');
const { askPhoneNumber, displayPhoneNumberConfirm } = require('../actions');

/**
 * Handle submit problem conversation
 * Note:
 * 
 * @param {object} context 
 * @param {function} next 
 */
const submitProblemHandler = async (context, next) => {
  const { locale } = context.state;
  if (context.state.dialog.submitProblem) {
    // This handler is active now
    if (context.event.isQuickReply) {
      const { payload } = context.event.quickReply;
      if (context.state.askingProblemService) {
        context.setState({
          problem: { service: payload },
          askingProblemService: false,
          askingProblemLocation: true
        });
        await context.sendText(i18n.__({ phrase: 'textShareLocation', locale }), {
          quick_replies: [{ "content_type": "location" }]
        })
        return;
      }
      if (context.state.askingPhoneNumberConfirm) {
        switch (payload) {
          case 'QUICK_CONFIRM_YES':
            submitProblem(context);
          // submit problem
          case 'QUICK_CONFIRM_NO':
            // add new phone number
            context.setState({ phoneNumber: null });
            confirmPhoneNum(context);
        }
      }
    }

    if (context.event.hasAttachment) {
      const { attachments } = context.event;
      if (context.state.askingProblemLocation) {
        // Attachment contain location data
        const { coordinates } = attachments[0].payload;
        context.setState({
          problem: { coordinates },
          askingProblemLocation: false
        });

        const problemMoreInfoMenu = i18n.__({
          phrase: 'menuProblemExtraInfoType',
          locale
        });
        // Modify menu items as per messenger requirement
        const messengerMenu = problemMoreInfoMenu.map(menu => {
          menu.type = 'postback';
          return menu;
        });
        // Display Menu
        await context.sendButtonTemplate(i18n.__({
          phrase: 'textAddProblemMoreInfo',
          locale
        }), messengerMenu);
      }

      if (context.state.askingProblemPicture) {
        const { url } = attachments[0].payload;
        context.setState({
          problem: { image: url, description: 'Created via Facebook Bot' },
          askingProblemPicture: false
        });
        confirmPhoneNum(context);
      }
      return;
    }

    if (context.event.isPostback) {
      // Postback event
      const { payload } = context.event.postback;
      switch (payload) {
        // PMI ~ Problem More Info
        case 'PMI_MENU_SEND_TEXT':
          // send text
          addProblemDesc(context);
          break;
        case 'PMI_MENU_SEND_PICTURE':
          //  send picture
          addProblemPicture(context);
          break;
        case 'PMI_MENU_CONTINUE':
          // continue with problem submission
          confirmPhoneNum(context);
          break;
      }
    }

    if (context.event.isText) {
      const { text } = context.event;
      if (context.state.askingProblemDesc) {
        context.setState({
          problem: { description: text },
          askingProblemDesc: false
        });
        confirmPhoneNum(context);
      }
      if (context.state.askingPhoneNumber) {
        context.setState({
          phoneNumber: text,
          askingPhoneNumber: false
        });
        confirmPhoneNum(context);
      }
    }

  } else {
    // Pass control to other handler
    await next();
  }

}

const addProblemDesc = async (context) => {
  context.setState({ askingProblemDesc: true });
  const { locale } = context.state;
  await context.sendText(i18n.__({ phrase: 'textAddProblemDesc', locale }));
}

const addProblemPicture = async (context) => {
  context.setState({ askingProblemPicture: true });
  const { locale } = context.state;
  await context.sendText(i18n.__({ phrase: 'textUploadProblemPicture', locale }));
}

const confirmPhoneNum = async (context) => {
  if (!context.state.phoneNumber) {
    // Phone number is not set
    context.setState({ askingPhoneNumber: true });
    askPhoneNumber(context);
  } else {
    // Phone number is set
    context.setState({ askingPhoneNumberConfirm: true });
    displayPhoneNumberConfirm(context);
  }
}

const submitProblem = async (context) => {

}



module.exports = submitProblemHandler;

