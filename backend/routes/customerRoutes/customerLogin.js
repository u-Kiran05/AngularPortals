const express = require('express');
const router = express.Router();
const { callSapService } = require("D:\\PortalProject\\backend\\utils\\parser.js")

router.post('/login', async (req, res) => {
  const { customerId, password } = req.body;

  if (!customerId || !password) {
    return res.status(400).json({ success: false, message: 'Customer ID and password are required.' });
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

  try {
    const rfcResponse = await callSapService({
      url: process.env.SAP_CLOGIN_URL?.trim(),
      soapEnvelope,
      soapAction: 'urn:sap-com:document:sap:rfc:functions:ZFM_CUSTOMER_LOGIN_VALIDATE',
      rfcFunction: 'ZFM_CUSTOMER_LOGIN_VALIDATE'
    });

    const message = rfcResponse.E_MESSAGE?.[0] || 'Unknown';
    const valid = rfcResponse.E_VALID?.[0] === 'Y';

    res.json({ success: valid, message });

  } catch (error) {
    console.error('LOGIN ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: 'SAP call failed',
      error: error.message
    });
  }
});

module.exports = router;
