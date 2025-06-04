const express = require('express');
const router = express.Router();
const { callSapService } = require("../../utils/parser");

router.post('/aging', async (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ success: false, message: 'Customer ID is required.' });
  }

  // Build SOAP envelope for ZFM_CAGING
  const soapEnvelope = `
    <soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"
                       xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soap-env:Header/>
      <soap-env:Body>
        <urn:ZFM_CAGING>
          <I_CUSTOMER_ID>${customerId}</I_CUSTOMER_ID>
          <T_AGING/>
        </urn:ZFM_CAGING>
      </soap-env:Body>
    </soap-env:Envelope>`;

  try {
    const rfcResponse = await callSapService({
      url: process.env.SAP_CAGING_URL?.trim(),
      soapEnvelope,
      soapAction: 'urn:sap-com:document:sap:rfc:functions:ZFM_CAGING',
      rfcFunction: 'ZFM_CAGING'
    });

    // Extract T_AGING from the SOAP response
    const agingItems = rfcResponse.T_AGING?.[0]?.item || [];
    const formattedAging = agingItems.map(item => ({
      vbeln: item.VBELN?.[0] || '',
      fkdat: item.FKDAT?.[0] || '',
      dueDate: item.DUE_DT?.[0] || '',
      netwr: parseFloat(item.NETWR?.[0] || '0'),
      waerk: item.WAERK?.[0] || '',
      aging: item.AGEING_DAYS?.[0]?.trim() || ''
    }));

    res.json({
      success: true,
      data: formattedAging
    });

  } catch (error) {
    console.error('CUSTOMER AGING ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: 'SAP Aging call failed',
      error: error.message
    });
  }
});

module.exports = router;
