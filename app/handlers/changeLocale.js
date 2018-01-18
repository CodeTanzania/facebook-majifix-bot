
/**
 * Handle change language conversation
 * Note:
 * Change language conversation is active when
 * context state dialog changelanguage is true
 * @param {object} context 
 * @param {function} next 
 */
module.exports = async (context, next) => {
  if (context.state.dialog.changeLanguage) {
    // This handler is active now
    if (context.event.isQuickReply) {
      const { payload } = context.event.quickReply;
      switch (payload) {
        case 'SW':
          context.setState({ locale: 'sw', dialog: { changeLanguage: false } });
          break;
        case 'EN':
          context.setState({ locale: 'en', dialog: { changeLanguage: false } });
          break;
      }
    }
  } else {
    // Pass control to other handler in the execution stack
    await next();
  }
}