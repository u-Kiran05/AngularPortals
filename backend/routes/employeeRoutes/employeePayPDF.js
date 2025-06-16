const express = require('express');
const router = express.Router();
const { callSapService } = require("../../utils/parser");

router.post('/payslip/download', async (req, res) => {
  const { employeeId } = req.body;

  if (!employeeId) {
    return res.status(400).json({ success: false, message: 'employeeId is required' });
  }

  const soapEnvelope = `
    <soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"
                       xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soap-env:Header/>
      <soap-env:Body>
        <urn:ZFM_EPAY_PDF>
          <I_EMP_ID>${employeeId}</I_EMP_ID>
        </urn:ZFM_EPAY_PDF>
      </soap-env:Body>
    </soap-env:Envelope>`;

  try {
    const rfcResponse = await callSapService({
      url: process.env.SAP_EPAY_PDF_URL?.trim(),
      soapEnvelope,
      soapAction: 'urn:sap-com:document:sap:rfc:functions:ZFM_EPAY_PDF',
      rfcFunction: 'ZFM_EPAY_PDF'
    });

    const pdfBase64 = rfcResponse.PDF_B64?.[0] || null;

    if (!pdfBase64) {
      return res.status(404).json({ success: false, message: 'PDF not found in SAP response' });
    }

    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Payslip_${employeeId}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('EMPLOYEE PAYSLIP DOWNLOAD ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to download employee payslip from SAP',
      error: error.message
    });
  }
});

module.exports = router;
