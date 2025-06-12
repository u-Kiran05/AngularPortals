const express = require('express');
const router = express.Router();
const { callSapService } = require("D:\\PortalProject\\backend\\utils\\parser.js"); // Adjust path as needed

router.post('/cand', async (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ success: false, message: 'Customer ID is required.' });
  }

  // Correct SOAP envelope for ZFM_CCANDD
  const soapEnvelope = `
    <soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"
                       xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soap-env:Header/>
      <soap-env:Body>
        <urn:ZFM_CCANDD>
          <I_CUSTOMER_ID>${customerId}</I_CUSTOMER_ID>
          <T_CREDIT/>
<T_DEBIT/>
        </urn:ZFM_CCANDD>
      </soap-env:Body>
    </soap-env:Envelope>`;

  try {
    const rfcResponse = await callSapService({
      url: process.env.SAP_CCANDD_URL?.trim(),
      soapEnvelope,
      soapAction: 'urn:sap-com:document:sap:rfc:functions:ZFM_CCANDD',
      rfcFunction: 'ZFM_CCANDD'
    });

// Extract and format credit (T_CREDIT) details
const creditItems = rfcResponse?.T_CREDIT?.[0]?.item || [];
const formattedCredit = creditItems.map(item => ({
  vbeln: item.VBELN?.[0] || '',
  fkart: item.FKART?.[0] || '',
  fktyp: item.FKTYP?.[0] || '',
  fkdat: item.FKDAT?.[0] || '',
  vbtyp: item.VBTYP?.[0] || '',
  netwr: parseFloat(item.NETWR?.[0] || item.NETWR || '0'),
  waerk: item.WAERK?.[0] || '',
  posnr: item.POSNR?.[0] || '',
  matnr: item.MATNR?.[0] || '',
  knumv: item.KNUMV?.[0] || '',
  kidno: item.KIDNO?.[0] || '',
  erzet: item.ERZET?.[0] || '',
  erdat: item.ERDAT?.[0] || '',
  vkorg: item.VKORG?.[0] || ''
}));

// Extract and format debit (T_DEBIT) details
const debitItems = rfcResponse?.T_DEBIT?.[0]?.item || [];
const formattedDebit = debitItems.map(item => ({
  vbeln: item.VBELN?.[0] || '',
  fkart: item.FKART?.[0] || '',
  fktyp: item.FKTYP?.[0] || '',
  fkdat: item.FKDAT?.[0] || '',
  vbtyp: item.VBTYP?.[0] || '',
  netwr: parseFloat(item.NETWR?.[0] || item.NETWR || '0'),
  waerk: item.WAERK?.[0] || '',
  posnr: item.POSNR?.[0] || '',
  matnr: item.MATNR?.[0] || '',
  knumv: item.KNUMV?.[0] || '',
  kidno: item.KIDNO?.[0] || '',
  erzet: item.ERZET?.[0] || '',
  erdat: item.ERDAT?.[0] || '',
  vkorg: item.VKORG?.[0] || ''
}));

// Return the properly flattened response
res.json({
  success: true,
  data: {
    credit: formattedCredit,
    debit: formattedDebit
  }
});



  } catch (error) {
    console.error('CUSTOMER C&D ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: 'SAP C&D call failed',
      error: error.message
    });
  }
});

module.exports = router;
