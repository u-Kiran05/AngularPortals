const express = require('express');
const router = express.Router();
const { callSapService } = require("D:\\PortalProject\\backend\\utils\\parser.js");

router.post('/invoice/download', async (req, res) => {
  debugger; // Added debugger statement to pause execution for inspection
  const { customerId, vbeln } = req.body;

  if (!customerId || !vbeln) {
    return res.status(400).json({ success: false, message: 'customerId and vbeln are required' });
  }

  // Build SOAP envelope for ZFM_CINVOICE_PDF
  const soapEnvelope = `
    <soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"
                       xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soap-env:Header/>
      <soap-env:Body>
        <urn:ZFM_CINVOICE_PDF>
          <I_CUSTOMER_ID>${customerId}</I_CUSTOMER_ID>
          <VBELN>${vbeln}</VBELN>
        </urn:ZFM_CINVOICE_PDF>
      </soap-env:Body>
    </soap-env:Envelope>`;

  try {
    const rfcResponse = await callSapService({
      url: process.env.SAP_CINVOICE_PDF_URL?.trim(),
      soapEnvelope,
      soapAction: 'urn:sap-com:document:sap:rfc:functions:ZFM_CINVOICE_PDF',
      rfcFunction: 'ZFM_CINVOICE_PDF'
    });

    // Extract PDF base64 string from the SAP response
    const pdfBase64 = rfcResponse.PDF_B64?.[0] || null;
   
    if (!pdfBase64) {
      return res.status(404).json({ success: false, message: 'PDF not found in SAP response' });
    }

    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=CustomerInvoice_${vbeln}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('INVOICE DOWNLOAD ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to download invoice from SAP',
      error: error.message
    });
  }
});

module.exports = router;