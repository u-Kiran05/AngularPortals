const express = require('express');
const router = express.Router();
const { callSapService } = require('../../utils/parser');

router.post('/ekpi', async (req, res) => {
  const { employeeId } = req.body;

  if (!employeeId) {
    return res.status(400).json({ success: false, message: 'Employee ID is required.' });
  }

  const soapEnvelope = `
    <soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"
                       xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soap-env:Header/>
      <soap-env:Body>
        <urn:ZFM_EMPKPI>
          <I_EMP_ID>${employeeId}</I_EMP_ID>
        </urn:ZFM_EMPKPI>
      </soap-env:Body>
    </soap-env:Envelope>`;

  try {
    const response = await callSapService({
      url: process.env.SAP_EKPI_URL?.trim(),
      soapEnvelope,
      soapAction: 'urn:sap-com:document:sap:rfc:functions:ZFM_EMPKPI',
      rfcFunction: 'ZFM_EMPKPI'
    });

    const kpi = response?.E_KPI?.[0] || {};

    const formattedKPI = {
      emp_id: kpi.EMP_ID?.[0] || '',
      aworkinghrs: parseFloat(kpi.AWORKINGHRS?.[0] || '0'),
      asalary: parseFloat(kpi.ASALARY?.[0] || '0'),
      leaves: parseFloat(kpi.LEAVES?.[0] || '0'),
      tenure_years: parseInt(kpi.TENURE_YEARS?.[0] || '0')
    };

    res.json({ success: true, data: formattedKPI });

  } catch (error) {
    console.error('EMPLOYEE KPI ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: 'SAP KPI request failed',
      error: error.message
    });
  }
});

module.exports = router;
