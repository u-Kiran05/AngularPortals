const express = require('express');
const router = express.Router();
const { callSapService } = require("D:\\PortalProject\\backend\\utils\\parser.js")

router.post('/sales', async (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ success: false, message: 'Customer ID is required.' });
  }

  const soapEnvelope = `
    <soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"
                       xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soap-env:Header/>
      <soap-env:Body>
        <urn:ZFM_CSALES>
          <I_CUSTOMER_ID>${customerId}</I_CUSTOMER_ID>
          <T_CSALES/>
        </urn:ZFM_CSALES>
      </soap-env:Body>
    </soap-env:Envelope>`;

  try {
    const rfcResponse = await callSapService({
      url: process.env.SAP_CSALES_URL?.trim(),
      soapEnvelope,
      soapAction: 'urn:sap-com:document:sap:rfc:functions:ZFM_CSALES',
      rfcFunction: 'ZFM_CSALES'
    });

    const salesItems = rfcResponse.T_CSALES?.[0]?.item || [];

    const formatted = salesItems.map(item => ({
      customerId: item.KUNNR?.[0] || '',
      salesOrg: item.VKORG?.[0] || '',
      distChannel: item.VTWEG?.[0] || '',
      division: item.SPART?.[0] || '',
      salesDistrict: item.BZIRK?.[0] || ''
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('SALES ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: 'SAP sales call failed',
      error: error.message
    });
  }
});

module.exports = router;
