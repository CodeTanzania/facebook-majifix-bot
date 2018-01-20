
const fetch = require('node-fetch');
const config = require('./bottender.config.js').messenger;


const API = {
  /**
   * Retrieve all services
   */
  getServices() {
    const url = `${config.BASE_API_URL}services.json`;
    return fetch(url)
      .then(res => res.json());
  }
};

module.exports = API;
