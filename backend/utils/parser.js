// utils/parser.js
const axios = require('axios');
const xml2js = require('xml2js');

async function callSapService({ url, soapEnvelope, soapAction, rfcFunction }) {
  const username = process.env.SAP_USERNAME;
  const password = process.env.SAP_PASSWORD;

  if (!url || !username || !password) {
    throw new Error('SAP credentials or URL are not set properly in environment variables.');
  }

  const { data } = await axios.post(url, soapEnvelope, {
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': soapAction
    },
    auth: { username, password },
    timeout: 10000
  });

  const parser = new xml2js.Parser();
  const result = await parser.parseStringPromise(data);

  const body = result['soap-env:Envelope']['soap-env:Body'][0];
  const rfcTag = Object.keys(body).find(key =>
    key.toLowerCase().includes(rfcFunction.toLowerCase())
  );
  if (!rfcTag) throw new Error(`RFC tag '${rfcFunction}' not found in SAP response.`);

  return body[rfcTag][0]; // return only the parsed RFC result
}

module.exports = { callSapService };
