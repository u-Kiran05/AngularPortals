const express = require('express');
const router = express.Router();
const { callSapService } = require('../../utils/parser');

router.post('/eprofile', async (req, res) => {
  const { employeeId } = req.body;

  function mapGender(code) {
    switch (code) {
      case '1': return 'Male';
      case '2': return 'Female';
      case '3': return 'Others';
      default: return 'Unknown';
    }
  }

  if (!employeeId) {
    return res.status(400).json({ success: false, message: 'Employee ID is required.' });
  }

  const soapEnvelope = `
    <soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"
                       xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soap-env:Header/>
      <soap-env:Body>
        <urn:ZFM_EPROFILE>
          <I_EMPLOYEE_ID>${employeeId}</I_EMPLOYEE_ID>
        </urn:ZFM_EPROFILE>
      </soap-env:Body>
    </soap-env:Envelope>`;

  try {
    const rfcResponse = await callSapService({
      url: process.env.SAP_EPROFILE_URL?.trim(),
      soapEnvelope,
      soapAction: 'urn:sap-com:document:sap:rfc:functions:ZFM_EPROFILE',
      rfcFunction: 'ZFM_EPROFILE'
    });

    const employeeData = rfcResponse.ES_PROFILE?.[0];
    if (!employeeData) {
      return res.status(404).json({ success: false, message: 'Employee data not found' });
    }

    res.json({
      id: employeeData.PERNR?.[0] || '',
      name: employeeData.ENAME?.[0] || '',
      gender: mapGender(employeeData.GESCH?.[0]),
      dob: employeeData.GBDAT?.[0] || '',
      nationality: employeeData.NATIO?.[0] || '',
      email: employeeData.USRID_LONG?.[0] || '',
      companyCode: employeeData.BUKRS?.[0] || '',
      subArea: employeeData.BTRTL?.[0] || '',
      costCenter: employeeData.KOSTL?.[0] || '',
      position: employeeData.PLANS?.[0] || '',
      job: employeeData.STELL?.[0] || '',
      payScaleGroup: employeeData.TRFST?.[0] || '',
      basicPay: employeeData.BET01?.[0] || '',
      maritalStatus: employeeData.FAMST?.[0] || '',
      address: employeeData.STRAS?.[0] || '',
      city: employeeData.ORT01?.[0] || '',
      postalCode: employeeData.PSTLZ?.[0] || '',
      country: employeeData.LAND1?.[0] || ''
    });

  } catch (error) {
    console.error('EPROFILE ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: 'SAP employee profile call failed',
      error: error.message
    });
  }
});

module.exports = router;
