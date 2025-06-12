const express = require('express');
const router = express.Router();
const { callSapService } = require("D:\\PortalProject\\backend\\utils\\parser.js");

router.post('/invoice', async (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ success: false, message: 'Customer ID is required.' });
  }

  const soapEnvelope = `
    <soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"
                       xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soap-env:Header/>
      <soap-env:Body>
        <urn:ZFM_CINVOICE>
          <I_CUSTOMER_ID>${customerId}</I_CUSTOMER_ID>
          <T_HEADER/>
          <T_ITEMS/>
        </urn:ZFM_CINVOICE>
      </soap-env:Body>
    </soap-env:Envelope>`;

  try {
    const rfcResponse = await callSapService({
      url: process.env.SAP_CINVOICE_URL?.trim(),
      soapEnvelope,
      soapAction: 'urn:sap-com:document:sap:rfc:functions:ZFM_CINVOICE',
      rfcFunction: 'ZFM_CINVOICE'
    });

    const headers = rfcResponse.T_HEADER?.[0]?.item || [];
    const items = rfcResponse.T_ITEMS?.[0]?.item || [];

    const formattedData = {
      headers: headers.map(header => ({
        vbeln: header.VBELN?.[0] || '',
        fkdat: header.FKDAT?.[0] || '',
        netwr: header.NETWR?.[0] || '',
        waerk: header.WAERK?.[0] || '',
        erdat: header.ERDAT?.[0] || '',
        bukrs: header.BUKRS?.[0] || ''
      })),
      items: items.map(item => ({
        vbeln: item.VBELN?.[0] || '',
        posnr: item.POSNR?.[0] || '',
        matnr: item.MATNR?.[0] || '',
        arktx: item.ARKTX?.[0] || '',
        fkimg: item.FKIMG?.[0] || '',
        vrkme: item.VRKME?.[0] || '',
        netwr: item.NETWR?.[0] || ''
      }))
    };

    res.json({ success: true, data: formattedData });

  } catch (error) {
    console.error('INVOICE ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: 'SAP invoice call failed',
      error: error.message
    });
  }
});

module.exports = router;
