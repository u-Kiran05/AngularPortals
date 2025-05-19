const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { customerId, password } = req.body;

  if (!customerId || !password) {
    return res.status(400).json({
      success: false,
      message: 'Customer ID and password are required.'
    });
  }

  const soapEnvelope = `
    <soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"
                       xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soap-env:Header/>
      <soap-env:Body>
        <urn:ZFM_CUSTOMER_LOGIN_VALIDATE>
          <I_CUSTOMER_ID>${customerId}</I_CUSTOMER_ID>
          <I_PASSWORD>${password}</I_PASSWORD>
        </urn:ZFM_CUSTOMER_LOGIN_VALIDATE>
      </soap-env:Body>
    </soap-env:Envelope>`;

  const sapUrl = process.env.SAP_URL?.trim();
  const username = process.env.SAP_USERNAME;
  const userpass = process.env.SAP_PASSWORD;

  if (!sapUrl || !username || !userpass) {
    return res.status(500).json({
      success: false,
      message: 'SAP credentials or URL are not set properly in environment variables.'
    });
  }

  try {
    console.log('Calling SAP with URL:', sapUrl);
    const { data } = await axios.post(sapUrl, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'urn:sap-com:document:sap:rfc:functions:ZFM_CUSTOMER_LOGIN_VALIDATE'
      },
      auth: {
        username: username,
        password: userpass
      },
      timeout: 10000
    });

    console.log('SAP Raw XML Response:\n', data);

    const parser = new xml2js.Parser();
    parser.parseString(data, (err, result) => {
      if (err) {
        console.error('XML Parsing Error:', err);
        return res.status(500).json({
          success: false,
          error: 'Failed to parse SAP XML response'
        });
      }

      try {
        const body = result['soap-env:Envelope']['soap-env:Body'][0];

        const rfcTag = Object.keys(body).find(key =>
          key.toLowerCase().includes('zfm_customer_login_validate')
        );
        if (!rfcTag) throw new Error('RFC response tag not found in SAP response');

        const rfcResponse = body[rfcTag][0];
        const message = rfcResponse.E_MESSAGE?.[0] || 'Unknown';
        const valid = rfcResponse.E_VALID?.[0] === 'Y';

        res.json({ success: valid, message });
      } catch (parseError) {
        console.error('Response Parsing Error:', parseError);
        res.status(500).json({
          success: false,
          error: 'SAP response parsing error'
        });
      }
    });

  } catch (error) {
    console.error('AXIOS ERROR:', {
      message: error.message,
      config: error.config?.url,
      status: error.response?.status,
      headers: error.response?.headers,
      responseData: error.response?.data
    });

    res.status(500).json({
      success: false,
      message: 'SAP call failed',
      error: error.message,
      details: error.response?.data || null
    });
  }
});

module.exports = router;
