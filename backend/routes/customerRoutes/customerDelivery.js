const express = require('express');
const router = express.Router();
const { callSapService } = require("../../utils/parser");

router.post('/delivery', async (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ success: false, message: 'Customer ID is required.' });
  }

  // Updated SOAP envelope with correct RFC call and input structure
  const soapEnvelope = `
    <soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"
                       xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soap-env:Header/>
      <soap-env:Body>
        <urn:ZFM_CDELIVERY>
          <I_CUSTOMER_ID>${customerId}</I_CUSTOMER_ID>
          <T_HEADER/>
          <T_ITEMS/>
        </urn:ZFM_CDELIVERY>
      </soap-env:Body>
    </soap-env:Envelope>`;

  try {
    const rfcResponse = await callSapService({
      url: process.env.SAP_CDELIVERY_URL?.trim(),
      soapEnvelope,
      soapAction: 'urn:sap-com:document:sap:rfc:functions:ZFM_CDELIVERY',
      rfcFunction: 'ZFM_CDELIVERY'
    });

    // Extract and format T_HEADER (Delivery Headers)
    const headers = rfcResponse.T_HEADER?.[0]?.item || [];
    const formattedHeaders = headers.map(h => ({
      vbeln: h.VBELN?.[0] || '',
      erdat: h.ERDAT?.[0] || '',
      lfdat: h.LFDAT?.[0] || '',
      vstel: h.VSTEL?.[0] || '',
      route: h.ROUTE?.[0] || '',
      waerk: h.WAERK?.[0] || ''
    }));

    // Extract and format T_ITEMS (Delivery Items)
    const items = rfcResponse.T_ITEMS?.[0]?.item || [];
    const formattedItems = items.map(i => ({
      vbeln: i.VBELN?.[0] || '',
      posnr: i.POSNR?.[0] || '',
      matnr: i.MATNR?.[0] || '',
      arktx: i.ARKTX?.[0] || '',
      lfimg: i.LFIMG?.[0] || ''
    }));

    // Respond with both headers and items
    res.json({
      success: true,
      data: {
        headers: formattedHeaders,
        items: formattedItems
      }
    });

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
