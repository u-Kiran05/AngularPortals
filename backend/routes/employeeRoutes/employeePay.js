const express = require('express');
const router = express.Router();
const { callSapService } = require("../../utils/parser");

router.post('/payslip', async (req, res) => {
  const { employeeId } = req.body;

  if (!employeeId) {
    return res.status(400).json({ success: false, message: 'Employee ID is required.' });
  }

  const soapEnvelope = `
    <soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"
                       xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soap-env:Header/>
      <soap-env:Body>
        <urn:ZFM_EPAY>
          <I_EMP_ID>${employeeId}</I_EMP_ID>
        </urn:ZFM_EPAY>
      </soap-env:Body>
    </soap-env:Envelope>`;

  try {
    const rfcResponse = await callSapService({
      url: process.env.SAP_EPAY_URL?.trim(),
      soapEnvelope,
      soapAction: 'urn:sap-com:document:sap:rfc:functions:ZFM_EPAY',
      rfcFunction: 'ZFM_EPAY'
    });

  const rawHeader = rfcResponse.E_HEADER?.[0] || {};
const header = {
  empId: rawHeader.EMP_ID?.[0] || '',
  empFirstName: rawHeader.EMP_FIRSTNAME?.[0] || '',
  empLastName: rawHeader.EMP_LASTNAME?.[0] || '',
  dob: rawHeader.DOB?.[0] || '',
  gender: rawHeader.GENDER?.[0] || '',
  orgKey: rawHeader.ORG_KEY?.[0] || '',
  payScaleType: rawHeader.PAY_SCALE_TYPE?.[0] || '',
  payScaleArea: rawHeader.PAY_SCALE_AREA?.[0] || '',
  payScaleGroup: rawHeader.PAY_SCALE_GROUP?.[0] || '',
  payScaleLevel: rawHeader.PAY_SCALE_LEVEL?.[0] || '',
  utilizationLevel: rawHeader.UTILIZATION_LEVEL?.[0] || '',
  annualSalary: rawHeader.ANNUAL_SALARY?.[0] || '',
  currency: rawHeader.CURRENCY?.[0] || '',
  netPay: rawHeader.NET_PAY?.[0] || '',
  grossPay: rawHeader.GROSS_PAY?.[0] || '',
  totalDeductions: rawHeader.TOTAL_DEDUCTIONS?.[0] || ''
};

    const items = rfcResponse.E_ITEMS?.[0]?.item || [];

    const formattedItems = items.map(i => ({
      wageType: i.WAGE_TYPE?.[0] || '',
      wageDesc: i.WAGE_DESC?.[0] || '',
      amount: i.AMOUNT?.[0] || '',
      unit: i.UNIT?.[0] || '',
      rate: i.RATE?.[0] || '',
      currency: i.CURRENCY?.[0] || ''
    }));

    res.json({
      success: true,
      data: {
        header,
        items: formattedItems
      }
    });

  } catch (error) {
    console.error('PAYSLIP ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: 'SAP payslip call failed',
      error: error.message
    });
  }
});

module.exports = router;
