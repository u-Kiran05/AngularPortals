const express = require('express');
const router = express.Router();
const axios = require('axios');
const xml2js = require('xml2js');

router.post('/invoice/download', async (req, res) => {
  const { customerId, vbeln } = req.body;

  if (!customerId || !vbeln) {
    return res.status(400).json({ success: false, message: 'customerId and vbeln are required' });
  }

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
    const authHeader = 'Basic ' + Buffer.from(`${process.env.SAP_USERNAME}:${process.env.SAP_PASSWORD}`).toString('base64');

    const sapResponse = await axios.post(process.env.SAP_CINVOICE_PDF_URL?.trim(), soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': 'urn:sap-com:document:sap:rfc:functions:ZFM_CINVOICE_PDF',
        'Authorization': authHeader
      }
    });

    xml2js.parseString(sapResponse.data, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error('XML Parse Error:', err);
        return res.status(500).json({ success: false, message: 'Failed to parse SAP response', error: err.message });
      }

      try {
        const pdfBase64 = result['soap-env:Envelope']['soap-env:Body']['n0:ZFM_CINVOICE_PDFResponse']['PDF_B64'];
        if (!pdfBase64) {
          return res.status(404).json({ success: false, message: 'PDF not found in SAP response' });
        }

        const pdfBuffer = Buffer.from(pdfBase64, 'base64');

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Invoice_${vbeln}.pdf`);
        res.send(pdfBuffer);
      } catch (e) {
        console.error('PDF Extraction Error:', e);
        res.status(500).json({ success: false, message: 'Failed to extract PDF from SAP response', error: e.message });
      }
    });
  } catch (error) {
    console.error('SAP CALL ERROR:', error.message);
    if (error.response) {
      console.error('SAP RESPONSE BODY:', error.response.data);
    }
    res.status(500).json({ success: false, message: 'Failed to call SAP service', error: error.message });
  }
});

module.exports = router;
