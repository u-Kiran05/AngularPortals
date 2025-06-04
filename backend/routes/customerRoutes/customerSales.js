const express = require('express');
const router = express.Router();
const { callSapService } = require("../../utils/parser");

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
          <T_HEADER/>
          <T_ITEMS/>
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

    const headerItems = rfcResponse?.T_HEADER?.[0]?.item || [];
    const itemItems = rfcResponse?.T_ITEMS?.[0]?.item || [];

    // Format headers
    const formattedHeaders = headerItems.map(item => ({
      salesOrderNo: item.VBELN?.[0] || '',
      docType: item.AUART?.[0] || '',
      orderDate: item.ERDAT?.[0] || '',
      netValue: item.NETWR?.[0] || '',
      currency: item.WAERK?.[0] || ''
    }));

    // Format items
    const formattedItems = itemItems.map(item => ({
      salesOrderNo: item.VBELN?.[0] || '',
      itemNo: item.POSNR?.[0] || '',
      materialNo: item.MATNR?.[0] || '',
      description: item.ARKTX?.[0] || '',
      netValue: item.NETWR?.[0] || '',
      quantity: item.KWMENG?.[0] || '',
      unit: item.VRKME?.[0] || '',
      currency: item.WAERK?.[0] || ''
    }));


    res.json({
      success: true,
      headerData: formattedHeaders,
      itemData: formattedItems
    });

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
