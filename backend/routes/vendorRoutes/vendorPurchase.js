const express = require('express');
const axios = require('axios');
const router = express.Router();

const SAP_VPO_URL = process.env.SAP_VPO_URL; 
const SAP_USERNAME = process.env.SAP_USERNAME;
const SAP_PASSWORD = process.env.SAP_PASSWORD;

const SAP_AUTH = 'Basic ' + Buffer.from(`${SAP_USERNAME}:${SAP_PASSWORD}`).toString('base64');

// Helper to convert SAP date format to 'dd-mm-yyyy'
function formatSapDate(sapDate) {
  const match = /\/Date\((\d+)\)\//.exec(sapDate);
  if (match) {
    const date = new Date(Number(match[1]));
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  return sapDate;
}

router.get('/Vorders/:vendorId', async (req, res) => {
  const { vendorId } = req.params;
  const odataUrl = `${SAP_VPO_URL}?$filter=Lifnr eq '${vendorId}'&$expand=ToPOItems`;

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

    const transformed = results.map(header => ({
      ebeln: header.Ebeln,
      bukrs: header.Bukrs,
      lifnr: header.Lifnr,
      bedat: formatSapDate(header.Bedat),
      bsart: header.Bsart,
      bstyp: header.Bstyp,
      items: (header.ToPOItems?.results || []).map(item => ({
        ebeln: item.Ebeln,
        ebelp: item.Ebelp,
        matnr: item.Matnr,
        menge: item.Menge,
        werks: item.Werks,
        netwr: item.Netwr
      }))
    }));

    res.json(transformed);

  } catch (error) {
    console.error('Error fetching PO data:', error.message);
    res.status(500).json({ error: 'Failed to fetch purchase order data' });
  }
});

module.exports = router;
