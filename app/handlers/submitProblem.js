
const i18n = require('i18n');
const merge = require('deepmerge');
const API = require('../api');
const { askPhoneNumber, displayPhoneNumberConfirm } = require('../prompts');

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
        // capture problem service category
        context.setState(merge(context.state, {
          problem: { service: payload },
          askingProblemService: false,
          askingProblemLocation: true
        }));
        await context.sendText(i18n.__({ phrase: 'textShareLocation', locale }), {
          quick_replies: [{ "content_type": "location" }]
        })
        return;
      }
      if (context.state.askingPhoneNumberConfirm) {
        // capture phone number valid confirmation
        switch (payload) {
          case 'QUICK_CONFIRM_YES':
            context.setState(merge(context.state, {
              askingPhoneNumberConfirm: false
            }));
            submitProblem(context);
            break;
          // submit problem
          case 'QUICK_CONFIRM_NO':
            // add new phone number
            context.setState(merge(context.state, {
              phoneNumber: null,
              askingPhoneNumberConfirm: false
            }));
            confirmPhoneNum(context);
            break;
        }
      }
    }

    if (context.event.hasAttachment) {
      const { attachments } = context.event;
      if (context.state.askingProblemLocation) {
        // capture problem location
        const { coordinates } = attachments[0].payload;
        context.setState(merge(context.state, {
          problem: { coordinates },
          askingProblemLocation: false
        }));

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
        // capture problem picture
        const { url } = attachments[0].payload;
        context.setState(merge(context.state, {
          problem: { image: url, description: 'Created via Facebook Bot' },
          askingProblemPicture: false
        }));
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

    if (context.event.isText && !context.event.isQuickReply) {
      const { text } = context.event;
      if (context.state.askingProblemDesc) {
        // capture problem description
        context.setState(merge(context.state, {
          problem: { description: text },
          askingProblemDesc: false
        }));
        confirmPhoneNum(context);
      } else if (context.state.askingPhoneNumber) {
        // capture phone number
        context.setState(merge(context.state, {
          phoneNumber: text,
          askingPhoneNumber: false
        }));
        confirmPhoneNum(context);
      }
    }

  } else {
    // Pass control to other handler
    await next();
  }

}

/**
 * Prompt for problem description
 * @param {*} context 
 */
const addProblemDesc = async (context) => {
  context.setState({ askingProblemDesc: true });
  const { locale } = context.state;
  await context.sendText(i18n.__({ phrase: 'textAddProblemDesc', locale }));
}

/**
 * Prompt for problem picture
 * @param {*} context 
 */
const addProblemPicture = async (context) => {
  context.setState({ askingProblemPicture: true });
  const { locale } = context.state;
  await context.sendText(i18n.__({ phrase: 'textUploadProblemPicture', locale }));
}

/**
 * Prompt user to confirm about entered phone number
 * @param {*} context 
 */
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
  const { problem, phoneNumber } = context.state;
  const { user } = context.session;
  let serviceRequest = {
    'description': problem.description,
    'first_name': user.first_name,
    'lat': problem.coordinates.lat,
    'long': problem.coordinates.long,
    'media_url': problem.image,
    'phone': phoneNumber,
    'service_code': problem.service
  }
  const result = await API.submitServiceRequest(serviceRequest);
}



module.exports = submitProblemHandler;

