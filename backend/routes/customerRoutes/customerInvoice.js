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
          <T_INVOICES/>
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

    const invoices = rfcResponse.T_INVOICES?.[0]?.item || [];

    const formattedInvoices = invoices.map(inv => ({
      vbeln: inv.VBELN?.[0] || '',
      fkdat: inv.FKDAT?.[0] || '',
      netwr: inv.NETWR?.[0] || '',
      waerk: inv.WAERK?.[0] || '',
      knumv: inv.KNUMV?.[0] || '',
      fkart: inv.FKART?.[0] || '',
      posnr: inv.POSNR?.[0] || '',
      matnr: inv.MATNR?.[0] || '',
      arktx: inv.ARKTX?.[0] || '',
      fkimg: inv.FKIMG?.[0] || '',
      vrkme: inv.VRKME?.[0] || ''
    }));

    res.json({ success: true, data: formattedInvoices });

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
