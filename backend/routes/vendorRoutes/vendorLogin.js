const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SAP_URL = process.env.SAP_VLOGIN_URL;
const SAP_USERNAME = process.env.SAP_USERNAME;
const SAP_PASSWORD = process.env.SAP_PASSWORD;

const SAP_AUTH = 'Basic ' + Buffer.from(`${SAP_USERNAME}:${SAP_PASSWORD}`).toString('base64');

router.post('/login', async (req, res) => {
  const { vendorId, password } = req.body;

  try {
    const response = await axios.post(
      SAP_URL,
      { VendorId: vendorId, Password: password },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
          'Authorization': SAP_AUTH,
          'Cookie': 'sap-usercontext=sap-client=100'
        }
      }
    );

    const status = response.data?.d?.Status || 'N';

    if (status === 'Y') {
      const token = jwt.sign(
        { id: vendorId, role: 'Vendor' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.json({ status: 'Y', token });
    } else {
      return res.json({ status: 'N' });
    }

  } catch (error) {
    console.error('Error from SAP OData:', error.message);
    res.json({ status: 'N' });
  }
});

module.exports = router;
