
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
  },
  submitServiceRequest(serviceRequest) {
    const url = `${config.BASE_API_URL}requests.json`;
    const options = {
      method: 'POST',
      body: { form: serviceRequest },
    };

    return fetch(url, options)
      .then(res => res.json());
  },
};

module.exports = API;
