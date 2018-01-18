
const i18n = require('i18n');

/**
 * Handle add phone number conversation
 * Note:
 * Add phone number conversation is active only when
 * context state dialog changephonenumber is true
 * @param {object} context 
 * @param {function} next 
 */
module.exports = async (context, next) => {
  if (context.state.dialog.changePhoneNumber) {
    // This handler is active now
    if (context.event.isText) {
      if (context.state.askingPhoneNumber) {
        // Close change phone number dialog, close ask phone number context and set phone number
        context.setState({
          phoneNumber: context.event.text,
          askingPhoneNumber: false,
          dialog: { changePhoneNumber: false }
        });
        await context.sendText(i18n.__({
          phrase: 'textPhoneNumReceivedNote',
          locale: context.state.locale
        },
          context.state.phoneNumber));
      }
    }
  } else {
    // Pass control to other handler in the execution stack
    await next();
  }
}