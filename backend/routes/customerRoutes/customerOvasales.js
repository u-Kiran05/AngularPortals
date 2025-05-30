const express = require('express');
const router = express.Router();
const { callSapService } = require("D:\\PortalProject\\backend\\utils\\parser.js");

router.post('/overallSales', async (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ success: false, message: 'Customer ID is required.' });
  }

  // Build SOAP envelope for ZFM_COVSALES
  const soapEnvelope = `
    <soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"
                       xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soap-env:Header/>
      <soap-env:Body>
        <urn:ZFM_COVSALES>
          <I_CUSTOMER_ID>${customerId}</I_CUSTOMER_ID>
          <T_OSALES/>
        </urn:ZFM_COVSALES>
      </soap-env:Body>
    </soap-env:Envelope>`;

  try {
    const rfcResponse = await callSapService({
      url: process.env.SAP_COVERALLSALES_URL?.trim(),
      soapEnvelope,
      soapAction: 'urn:sap-com:document:sap:rfc:functions:ZFM_COVSALES',
      rfcFunction: 'ZFM_COVSALES'
    });

    // Extract T_OSALES from the SOAP response
    const salesItems = rfcResponse.T_OSALES?.[0]?.item || [];
    const formattedSales = salesItems.map(item => ({
      currency: item.WAERK?.[0] || '',
      docType: item.AUART?.[0] || '',
      customerId: item.KUNNR?.[0] || '',
      salesOrg: item.VKORG?.[0] || '',
      recordType: item.RECORD_TYPE?.[0] || '',
      documentNo: item.DOCUMENT_NO?.[0] || '',
      docDate: item.DOC_DATE?.[0] || '',
      totalOrders: parseInt(item.TOTAL_ORDERS?.[0] || '0', 10),
      totalOrderValue: parseFloat(item.TOTAL_ORDER_VALUE?.[0] || '0'),
      totalBilled: parseFloat(item.TOTAL_BILLED?.[0] || '0')
    }));

    res.json({
      success: true,
      data: formattedSales
    });
  } catch (error) {
    console.error('CUSTOMER OVERALL SALES ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: 'SAP Overall Sales call failed',
      error: error.message
    });
  }
});

module.exports = router;
