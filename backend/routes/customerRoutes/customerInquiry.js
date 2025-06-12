const express = require('express');
const router = express.Router();
const { callSapService } = require("D:\\PortalProject\\backend\\utils\\parser.js");

router.post('/inquiry', async (req, res) => {
    console.log('Request body:', req.body);
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ success: false, message: 'Customer ID is required.' });
  }
  const soapEnvelope = `
    <soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"
                       xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soap-env:Header/>
      <soap-env:Body>
        <urn:ZFM_CINQUIRY>
          <I_CUSTOMER_ID>${customerId}</I_CUSTOMER_ID>
          <T_HEADER/>
          <T_ITEMS/>
        </urn:ZFM_CINQUIRY>
      </soap-env:Body>
    </soap-env:Envelope>`;

  try {
    const rfcResponse = await callSapService({
      url: process.env.SAP_CINQUIRY_URL?.trim(),
      soapEnvelope,
      soapAction: 'urn:sap-com:document:sap:rfc:functions:ZFM_CINQUIRY',
      rfcFunction: 'ZFM_CINQUIRY'
    });

    const headers = rfcResponse.T_HEADER?.[0]?.item || [];
    const items = rfcResponse.T_ITEMS?.[0]?.item || [];

    res.json({
      success: true,
      data: {
        inquiries: headers.map(h => ({
          vbeln: h.VBELN?.[0] || '',
          erdat: h.ERDAT?.[0] || '',
          auart: h.AUART?.[0] || '',
          angdt: h.ANGDT?.[0] || '',
          bnddt: h.BNDDT?.[0] || ''
        })),
        inquiryItems: items.map(i => ({
          vbeln: i.VBELN?.[0] || '',
          posnr: i.POSNR?.[0] || '',
          matnr: i.MATNR?.[0] || '',
          arktx: i.ARKTX?.[0] || '',
          kwmeng: i.KWMENG?.[0] || '',
          vrkme: i.VRKME?.[0] || ''
        }))
      }
    });
  } catch (error) {
    console.error('INQUIRY ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: 'SAP inquiry call failed',
      error: error.message
    });
  }
});

module.exports = router;
