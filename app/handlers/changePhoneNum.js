
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
    const { locale } = context.session._data;
    // This handler is active now
    if (context.event.isText) {
      if (context.state.askingPhoneNumber) {
        // Close change phone number dialog
        context.session._data.phoneNumber = context.event.text;
        // close ask phone number context and set phone number
        context.setState({
          askingPhoneNumber: false,
          dialog: { changePhoneNumber: false }
        });
        await context.sendText(i18n.__({
          phrase: 'textPhoneNumReceivedNote',
          locale: locale
        },
          context.session._data.phoneNumber));
      }
    }
  }
  // Pass control to other handler in the execution stack
  await next();
}