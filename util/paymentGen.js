const axios = require('axios');
const crypto = require('crypto')

const paymentGen = (options) => {
  const marchantId = '2547916';
  const serviceTypeId = '4430731';
  const APIKEY = '1946';
  // const service = 'lslkdlsk';
  const concats = marchantId + serviceTypeId + options.orderId + options.amount + APIKEY;
  const hash = crypto.createHash('sha512');
  const data = hash.update(concats, 'utf-8');
  const gen_hash = data.digest('hex');

  const data1 = {
    payerSurname: options.payerSurname,
    amount: options.amount,
    payerName: options.payerName,
    orderId: options.orderId,
    payerPhone: options.payerPhone,
    payerEmail: options.payerEmail,
    paymentId: options.paymentId,
    marchantId: options.marchantId,
    serviceTypeId: options.serviceTypeId,
  }

  axios({
    method: 'post',
    url: 'https://remitademo.net/remita/exapp/api/v1/send/api/echannelsvc/merchant/api/paymentinit',
    data: data1,
   headers: { 
    'Content-Type': 'application/json', 
    'Authorization': `remitaConsumerKey=${marchantId},remitaConsumerToken=${gen_hash}`
  },
  })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
};

// const data = {
//   payerSurname: 'kene',
//   amount: 232,
//   payerName: 'oiwlks',
//   orderId: '98woisosi',
//   payerPhone: 23982983,
//   payerEmail: 'keay@mail.com',
//   paymentId: '298oisoi9829',
//   marchantId: 'oiw9283792',
//   serviceTypeId: '4430731',
// };

// paymentGen(data);

module.exports = paymentGen;