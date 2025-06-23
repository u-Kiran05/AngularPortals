// utils/sapHealthChecker.js

const axios = require('axios');
require('dotenv').config();

let sapStatus = {
  up: false,
  message: 'Not checked yet',
  lastChecked: null
};

async function checkSAPHealth() {
  try {
    const response = await axios.get(process.env.SAP_PING_URL, {
      auth: {
        username: process.env.SAP_USERNAME,
        password: process.env.SAP_PASSWORD
      },
      timeout: 2500
    });

    const message = response?.data?.d?.results?.[0]?.Message || 'No message returned';

    sapStatus = {
      up: true,
      message,
      lastChecked: new Date().toISOString()
    };
   // console.log('SAP is up:', message);
  } catch (error) {
    sapStatus = {
      up: false,
      message: error.message,
      lastChecked: new Date().toISOString()
    };

   // console.error('SAP is down:', error.message);
  }
}

function getSAPStatus() {
  return sapStatus;
}

module.exports = {
  checkSAPHealth,
  getSAPStatus
};
