const express = require('express');
const router = express.Router();
const { callSapService } = require("D:\\PortalProject\\backend\\utils\\parser.js")

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

  try {
    const rfcResponse = await callSapService({
      url: process.env.SAP_CPROFILE_URL?.trim(),
      soapEnvelope,
      soapAction: 'urn:sap-com:document:sap:rfc:functions:ZFM_CPROFILE',
      rfcFunction: 'ZFM_CPROFILE'
    });

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

  } catch (error) {
    console.error('PROFILE ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: 'SAP profile call failed',
      error: error.message
    });
  }
});

module.exports = router;
