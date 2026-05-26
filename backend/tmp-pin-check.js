const axios = require('axios');
const https = require('https');
axios.get('https://api.postalpincode.in/pincode/629204', {
  httpsAgent: new https.Agent({ rejectUnauthorized: false })
})
  .then(res => {
    console.log('status', res.status);
    console.log(JSON.stringify(res.data, null, 2));
  })
  .catch(err => {
    console.error('error', err && err.toString());
    if (err.response) {
      console.error('resp status', err.response.status, JSON.stringify(err.response.data, null, 2));
    }
  });
