const axios = require('axios');
var raw = {
      to: phone,
      from: "VERIPAY",
      vendor_code: "",
      msg: message,
    };

    axios
      .post("https://api.appmartgroup.com/v3/sms/postSend", raw, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Connection: "Keep-Alive",
          apiKey: "",
          "User-Agent": "Apache-HttpClient/4.1.1",
        },
      })
      .then((result) => console.log("tax Id gotten"))
      .catch((error) => console.log("error", error));

module.exports = raw;