const express = require('express');
const axios = require('axios');
const router = express.Router();

const SAP_VPROFILE_URL = process.env.SAP_VPROFILE_URL; 
const SAP_USERNAME = process.env.SAP_USERNAME;
const SAP_PASSWORD = process.env.SAP_PASSWORD;

const SAP_AUTH = 'Basic ' + Buffer.from(`${SAP_USERNAME}:${SAP_PASSWORD}`).toString('base64');

router.get('/vprofile/:vendorId', async (req, res) => {
  const { vendorId } = req.params;
  const odataUrl = `${SAP_VPROFILE_URL}('${vendorId}')`;

  try {
    const response = await axios.get(odataUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': SAP_AUTH,
        'Cookie': 'sap-usercontext=sap-client=100'
      }
    });

    const data = response.data?.d;
    if (!data) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    res.json({
      lifnr: data.Lifnr,
      name: data.Name1,
      city: data.Ort01,
      address: data.Stras,
      country: data.Land1,
      postalCode: data.Pstlz,
     // region: data.Regio,
      addressNumber: data.Adrnr
    });

  } catch (error) {
    console.error('Error fetching vendor profile:', error.message);
    res.status(500).json({ error: 'Failed to fetch vendor profile' });
  }
});

module.exports = router;
