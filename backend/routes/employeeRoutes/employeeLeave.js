const express = require('express');
const router = express.Router();
const { callSapService } = require('../../utils/parser');

router.post('/eleave', async (req, res) => {
  const { employeeId } = req.body;

  if (!employeeId) {
    return res.status(400).json({ success: false, message: 'Employee ID is required.' });
  }


  const soapEnvelope = `
    <soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"
                       xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soap-env:Header/>
      <soap-env:Body>
        <urn:ZFM_ELEAVE>
          <I_EMPLOYEE_ID>${employeeId}</I_EMPLOYEE_ID>
          <ET_LEAVE/>
        </urn:ZFM_ELEAVE>
      </soap-env:Body>
    </soap-env:Envelope>`;

  try {
    const response = await callSapService({
      url: process.env.SAP_ELEAVE_URL?.trim(),
      soapEnvelope,
      soapAction: 'urn:sap-com:document:sap:rfc:functions:ZFM_ELEAVE',
      rfcFunction: 'ZFM_ELEAVE'
    });

    const leaveItems = response?.ET_LEAVE?.[0]?.item || [];

    const formattedLeave = leaveItems.map(item => ({
      pernr: item.PERNR?.[0] || '',
      awart: item.AWART?.[0] || '',
      begda: item.BEGDA?.[0] || '',
      endda: item.ENDDA?.[0] || '',
      abrtg: parseFloat(item.ABRTG?.[0] || '0'),
      anzhl: parseFloat(item.ANZHL?.[0] || '0'),
      stdaz: parseFloat(item.STDAZ?.[0] || '0'),
      abrst: parseFloat(item.ABRST?.[0] || '0')
    }));

    res.json({ success: true, data: formattedLeave });

  } catch (error) {
    console.error('EMPLOYEE LEAVE ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: 'SAP leave request failed',
      error: error.message
    });
  }
});

module.exports = router;
