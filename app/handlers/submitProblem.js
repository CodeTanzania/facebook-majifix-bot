
const i18n = require('i18n');

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

        const actionAddProblemMoreInfoMenu = i18n.__({
          phrase: 'menuProblemExtraInfoType',
          locale
        });
        const messengerMenu = actionAddProblemMoreInfoMenu.map(menu => {
          menu.type = 'postback';
          return menu;
        });
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
          cancelProblemMoreInfo(context);
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



module.exports = submitProblemHandler;

