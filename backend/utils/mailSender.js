const express = require('express');
const nodemailer = require('nodemailer');
const { callSapService } = require('./parser');
require('dotenv').config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_MAIL_PASS,
  },
});

router.post('/sendemail', async (req, res) => {
  const { employeeId, to } = req.body;

  if (!employeeId || !to) {
    return res.status(400).json({ error: 'employeeId and recipient email are required' });
  }

  // 1. SAP call to fetch employee details
  const headerEnvelope = `
    <soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"
                       xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soap-env:Header/>
      <soap-env:Body>
        <urn:ZFM_EPAY>
          <I_EMP_ID>${employeeId}</I_EMP_ID>
        </urn:ZFM_EPAY>
      </soap-env:Body>
    </soap-env:Envelope>`;

  // 2. SAP call to fetch PDF (base64)
  const pdfEnvelope = `
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
    const headerResponse = await callSapService({
      url: process.env.SAP_EPAY_URL?.trim(),
      soapEnvelope: headerEnvelope,
      soapAction: 'urn:sap-com:document:sap:rfc:functions:ZFM_EPAY',
      rfcFunction: 'ZFM_EPAY'
    });

    const pdfResponse = await callSapService({
      url: process.env.SAP_EPAY_PDF_URL?.trim(),
      soapEnvelope: pdfEnvelope,
      soapAction: 'urn:sap-com:document:sap:rfc:functions:ZFM_EPAY_PDF',
      rfcFunction: 'ZFM_EPAY_PDF'
    });

    const emp = headerResponse.E_HEADER?.[0] || {};
    const pdfBase64 = pdfResponse.PDF_B64?.[0];

    if (!pdfBase64) {
      return res.status(404).json({ error: 'PDF not found in SAP response' });
    }

    const fullName = `${emp.EMP_FIRSTNAME?.[0] || ''} ${emp.EMP_LASTNAME?.[0] || ''}`;
   const html = `
  <div style="font-family: Arial, sans-serif; font-size: 15px; color: #333;">
    <h3>Hello ${fullName},</h3>
    <p>Please find your <strong>official payslip</strong> attached as a PDF document.</p>

    <table style="border-collapse: collapse; width: 100%; margin-top: 20px;">
      <tr style="background-color: #f2f2f2;">
        <th style="text-align: left; padding: 8px;">Detail</th>
        <th style="text-align: left; padding: 8px;">Value</th>
      </tr>
      <tr>
        <td style="padding: 8px;">Employee ID</td>
        <td style="padding: 8px;">${employeeId}</td>
      </tr>
      <tr>
        <td style="padding: 8px;">Full Name</td>
        <td style="padding: 8px;">${fullName}</td>
      </tr>
      <tr>
        <td style="padding: 8px;">Organization Code</td>
        <td style="padding: 8px;">${emp.ORG_KEY?.[0]}</td>
      </tr>
      <tr>
        <td style="padding: 8px;">utilization Level</td>
        <td style="padding: 8px;">${emp.UTILIZATION_LEVEL?.[0]  } </td>
      </tr>
      <tr>
        <td style="padding: 8px;">Pay Scale Group</td>
        <td style="padding: 8px;">${emp.PAY_SCALE_GROUP?.[0] }</td>
      </tr>
      <tr>
        <td style="padding: 8px;">Pay Scale Type</td>
        <td style="padding: 8px;">${emp.PAY_SCALE_TYPE?.[0] || '-'}</td>
      </tr>
     
    </table>

    <p style="margin-top: 20px;">If you have any questions regarding your payslip, please contact the HR department.</p>
    <p>Regards,<br><strong>HR Department</strong></p>
  </div>
`;


    await transporter.sendMail({
      from: `"ERP Portal" <${process.env.SMTP_MAIL}>`,
      to,
      subject: `Payslip for Employee ID: ${employeeId}`,
      html,
      attachments: [
        {
          filename: `Payslip_${employeeId}.pdf`,
          content: Buffer.from(pdfBase64, 'base64'),
          contentType: 'application/pdf',
        }
      ]
    });

    res.status(200).json({ message: 'Email with payslip sent successfully!' });
  } catch (error) {
    console.error('EMAIL SEND ERROR:', error.message);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

module.exports = router;
