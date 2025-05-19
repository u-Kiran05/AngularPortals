const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const router = express.Router();

router.post('/profile', async (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ success: false, message: 'Customer ID is required.' });
  }

  const soapEnvelope = `
    <soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"
                       xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soap-env:Header/>
      <soap-env:Body>
        <urn:ZFM_CPROFILE>
          <I_CUSTOMER_ID>${customerId}</I_CUSTOMER_ID>
        </urn:ZFM_CPROFILE>
      </soap-env:Body>
    </soap-env:Envelope>`;

  const url = process.env.SAP_PROFILE_URL?.trim();
  const username = process.env.SAP_USERNAME;
  const password = process.env.SAP_PASSWORD;

  if (!url || !username || !password) {
    return res.status(500).json({
      success: false,
      message: 'SAP credentials or PROFILE URL are not set properly in environment variables.'
    });
  }

  try {
    console.log('Calling SAP Profile with URL:', url);

    const { data } = await axios.post(url, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'urn:sap-com:document:sap:rfc:functions:ZFM_CPROFILE'
      },
      auth: {
        username,
        password
      },
      timeout: 10000
    });

    console.log('SAP Profile Raw XML Response:\n', data);

    const parser = new xml2js.Parser();
    parser.parseString(data, (err, result) => {
      if (err) {
        console.error('XML Parsing Error:', err);
        return res.status(500).json({
          success: false,
          error: 'Failed to parse SAP profile XML response'
        });
      }

      try {
        const body = result['soap-env:Envelope']['soap-env:Body'][0];

        const rfcTag = Object.keys(body).find(key =>
          key.toLowerCase().includes('zfm_cprofile')
        );
        if (!rfcTag) throw new Error('RFC profile response tag not found');

        const rfcResponse = body[rfcTag][0];
        const customerData = rfcResponse.E_CUSTOMER_DATA?.[0];

        if (!customerData) {
          return res.status(404).json({ success: false, message: 'Customer data not found' });
        }

        res.json({
          id: customerData.KUNNR?.[0] || '',
          name: customerData.NAME1?.[0] || '',
          country: customerData.LAND1?.[0] || '',
          city: customerData.ORT01?.[0] || '',
          postalCode: customerData.PSTLZ?.[0] || '',
          street: customerData.STRAS?.[0] || ''
        });
      } catch (e) {
        console.error('Profile Response Parsing Error:', e);
        res.status(500).json({ success: false, error: 'SAP profile parsing error' });
      }
    });

  } catch (error) {
    console.error('AXIOS ERROR (Profile):', {
      message: error.message,
      config: error.config?.url,
      status: error.response?.status,
      headers: error.response?.headers,
      responseData: error.response?.data
    });

    res.status(500).json({
      success: false,
      message: 'SAP profile call failed',
      error: error.message,
      details: error.response?.data || null
    });
  }
});

module.exports = router;
