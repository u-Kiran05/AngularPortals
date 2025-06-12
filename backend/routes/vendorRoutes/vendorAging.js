const express = require('express');
const axios = require('axios');
const router = express.Router();

const SAP_VAGING_URL = process.env.SAP_VAGING_URL;
const SAP_USERNAME = process.env.SAP_USERNAME;
const SAP_PASSWORD = process.env.SAP_PASSWORD;

const SAP_AUTH = 'Basic ' + Buffer.from(`${SAP_USERNAME}:${SAP_PASSWORD}`).toString('base64');


function formatSapDate(sapDate) {
  const match = /\/Date\((\d+)\)\//.exec(sapDate);
  if (match) {
    const date = new Date(Number(match[1]));
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  return sapDate;
}

// Endpoint: /Vendors/Aging/:vendorId
router.get('/vaging/:vendorId', async (req, res) => {
  const { vendorId } = req.params;
  const odataUrl = `${SAP_VAGING_URL}?$filter=Lifnr eq '${vendorId}'&$format=json`;

  try {
    const response = await axios.get(odataUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': SAP_AUTH,
        'Cookie': 'sap-usercontext=sap-client=100'
      }
    });

    const results = response.data?.d?.results || [];

    const transformed = results.map(entry => ({
      belnr: entry.Belnr,
      gjahr: entry.Gjahr,
      budat: formatSapDate(entry.Budat),
      zfbdt: formatSapDate(entry.Zfbdt),
      wrbtr: entry.Wrbtr,
      wmwst: entry.Wmwst,
      netAmount: entry.NetAmount,
      daysAging: entry.DaysAging,
      waers: entry.Waers,
      lifnr: entry.Lifnr,
      mwskz: entry.Mwskz
    }));

    res.json(transformed);
  } catch (error) {
    console.error('Error fetching vendor aging data:', error.message);
    res.status(500).json({ error: 'Failed to fetch vendor aging data' });
  }
});

module.exports = router;
