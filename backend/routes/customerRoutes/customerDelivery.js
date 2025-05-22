const express = require('express');
const router = express.Router();
const { callSapService } = require("D:\\PortalProject\\backend\\utils\\parser.js");

router.post('/delivery', async (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ success: false, message: 'Customer ID is required.' });
  }

  const soapEnvelope = `
    <soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"
                       xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soap-env:Header/>
      <soap-env:Body>
        <urn:ZFM_CUDELIVERY>
          <I_CUSTOMER_ID>${customerId}</I_CUSTOMER_ID>
          <T_DELIVERIES/>
        </urn:ZFM_CUDELIVERY>
      </soap-env:Body>
    </soap-env:Envelope>`;

  try {
    const rfcResponse = await callSapService({
      url: process.env.SAP_CDELIVERY_URL?.trim(),
      soapEnvelope,
      soapAction: 'urn:sap-com:document:sap:rfc:functions:ZFM_CUDELIVERY',
      rfcFunction: 'ZFM_CUDELIVERY'
    });

    const deliveries = rfcResponse.T_DELIVERIES?.[0]?.item || [];

    const formattedDeliveries = deliveries.map(d => ({
      vbeln: d.VBELN?.[0] || '',
      erdat: d.ERDAT?.[0] || '',
      kunnr: d.KUNNR?.[0] || '',
      matnr: d.MATNR?.[0] || '',
      arktx: d.ARKTX?.[0] || '',
      lfimg: d.LFIMG?.[0] || '',
      meins: d.MEINS?.[0] || ''
    }));

    res.json({ success: true, data: formattedDeliveries });

  } catch (error) {
    console.error('DELIVERY ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: 'SAP delivery call failed',
      error: error.message
    });
  }
});

module.exports = router;
