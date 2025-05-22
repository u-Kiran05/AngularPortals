const express = require('express');
const router = express.Router();
const { callSapService } = require("D:\\PortalProject\\backend\\utils\\parser.js");

router.post('/sales', async (req, res) => {
  const { customerId } = req.body;
  console.log('Request body:', req.body);

  if (!customerId) {
    console.log('Missing customerId');
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

   // console.log('RFC Response:', JSON.stringify(rfcResponse, null, 2));

    // Access T_CSALES[0].item to get the array of items
    const salesItems = rfcResponse?.T_CSALES?.[0]?.item || [];
    //console.log('Sales Items:', salesItems.length, 'items');

    const formatted = salesItems.map(item => {
      //console.log('Processing item:', item);
      return {
        salesOrderNo: item.VBELN?.[0] || '',
        docType: item.AUART?.[0] || '',
        orderDate: item.ERDAT?.[0] || '',
        salesOrg: item.VKORG?.[0] || '',
        salesOrgName: item.VKORG_NAME?.[0] || '',  // ← 
        distChannel: item.VTWEG?.[0] || '',
        division: item.SPART?.[0] || '',
        materialNo: item.MATNR?.[0] || '',
        description: item.ARKTX?.[0] || '',
        netValue: item.NETWR?.[0] || '',
        currency: item.WAERK?.[0] || ''
      };
    });

    //console.log('Formatted Response:', formatted);
    //console.log('Sending response to client');
    res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('SALES ERROR:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'SAP sales call failed',
      error: error.message
    });
  }
});
module.exports = router;
