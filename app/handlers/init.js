/**
 * This handler is called first in any session as result
 * it is used to set some data that are session dependent.
 * @param {object} context 
 * @param {function} next 
 */
module.exports = async (context, next) => {
  const { session } = context;
  if (!session._data) {
    Object.defineProperty(session, '_data', {
      configurable: false,
      enumerable: true,
      writable: true,
      value: { locale: 'sw', issues: [] }
    });
  }
  await next();
}