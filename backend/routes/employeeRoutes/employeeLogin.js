const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { callSapService } = require("../../utils/parser");

router.post('/login', async (req, res) => {
  const { employeeId, password } = req.body;

 // console.log('[EmployeeLogin] Login attempt received');
 // console.log(`[EmployeeLogin] Input - ID: ${employeeId}, Password: ${'*'.repeat(password.length)}`);

  if (!employeeId || !password) {
  //  console.log('[EmployeeLogin] Missing credentials');
    return res.status(400).json({ success: false, message: 'Employee ID and password are required.' });
  }

  const soapEnvelope = `
    <soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"
                       xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soap-env:Header/>
      <soap-env:Body>
        <urn:ZFM_ELOGIN>
          <I_EMPLOYEE_ID>${employeeId}</I_EMPLOYEE_ID>
          <I_PASSWORD>${password}</I_PASSWORD>
        </urn:ZFM_ELOGIN>
      </soap-env:Body>
    </soap-env:Envelope>`;

  try {
//console.log('[EmployeeLogin] Sending request to SAP...');
    const rfcResponse = await callSapService({
      url: process.env.SAP_ELOGIN_URL?.trim(),
      soapEnvelope,
      soapAction: 'urn:sap-com:document:sap:rfc:functions:ZFM_ELOGIN',
      rfcFunction: 'ZFM_ELOGIN'
    });

    const message = rfcResponse.E_MESSAGE?.[0] || 'Unknown';
    const valid = rfcResponse.E_VALID?.[0] === 'Y';

   // console.log('[EmployeeLogin] SAP Response:', { E_VALID: rfcResponse.E_VALID, E_MESSAGE: message });

    if (valid) {
      const token = jwt.sign(
        { id: employeeId, role: 'Employee' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

    //  console.log('[EmployeeLogin] Login successful. Token generated.');
      return res.json({
        success: true,
        message,
        token
      });
    } else {
     // console.log('[EmployeeLogin] SAP validation failed:', message);
      return res.json({ success: false, message });
    }

  } catch (error) {
   // console.log('[EmployeeLogin] LOGIN ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: 'SAP call failed',
      error: error.message
    });
  }
});

module.exports = router;
