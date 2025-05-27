// utils/parser.js
const axios = require('axios');
const xml2js = require('xml2js');

async function callSapService({ url, soapEnvelope, soapAction, rfcFunction }) {
  const username = process.env.SAP_USERNAME;
  const password = process.env.SAP_PASSWORD;

  console.log('SAP Config:', { url, username, password: '***' });
  //console.log('SAP Request:', { soapAction, soapEnvelope });

  if (!url || !username || !password) {
    throw new Error('SAP credentials or URL are not set properly in environment variables.');
  }

  try {
    const { data } = await axios.post(url, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': soapAction
      },
      auth: { username, password },
      timeout: 30000 // Increase to 30 seconds
    });

    console.log('SAP Raw Response:', data);

    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(data);
    //console.log('Parsed SAP Response:', JSON.stringify(result, null, 2));

    const body = result['soap-env:Envelope']['soap-env:Body'][0];
    const rfcTag = Object.keys(body).find(key =>
      key.toLowerCase().includes(rfcFunction.toLowerCase()) || key.includes(`${rfcFunction}Response`)
    );
    if (!rfcTag) throw new Error(`RFC tag '${rfcFunction}' not found in SAP response.`);

    console.log('RFC Result:', body[rfcTag][0]);
    return body[rfcTag][0];
  } catch (error) {
    console.error('SAP Call Error:', error.message, error.stack);
     if (error.response) {
    console.error('Status:', error.response.status);
    console.error('Response Data:', error.response.data); 
  }
    throw error;
  }
}

module.exports = { callSapService };