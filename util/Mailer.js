const axios = require('axios');
const logger = require('../util/logger')

const sendMail = (email, message, subject) => {
  var FormData = require('form-data');
  var data = new FormData();
  data.append('to', email);
  data.append('sender_email', 'kalchuka@gmail.com');
  data.append('vendor_code', '788897564');
  data.append('msg', message);
  data.append('subject', subject);

    
  var config = {
    method: 'post',
    url: 'https://105.112.130.227:8002/v3/mail/postSend',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
      'apiKey': 'wqree45QRWg123559Lm1',
      'User-Agent': 'Apache-HttpClient/4.1.1',
      'Connection': 'Keep-Alive',
      ...data.getHeaders()
    },
    data: data
  };
  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      logger.filecheck('Info: mail sent successfully ${email} \n')

    })
    .catch(function (error) {
      console.log(JSON.stringify(error));
      logger.filecheck('Error: mail could not be sent ${JSON.stringify(error)} \n');
    });
};

module.exports = sendMail;
  