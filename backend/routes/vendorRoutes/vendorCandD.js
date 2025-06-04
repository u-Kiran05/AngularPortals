const express = require('express');
const axios = require('axios');
const router = express.Router();

const SAP_VCANDD_URL = process.env.SAP_VCANDD_URL;
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

router.get('/vcandd/:vendorId', async (req, res) => {

    const { vendorId } = req.params;
  const odataUrl = `${SAP_VCANDD_URL}?$filter=Lifnr eq '${vendorId}'&$format=json`;

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

    const formatEntry = entry => ({
      belnr: entry.Belnr,
      gjahr: entry.Gjahr,
      bukrs: entry.Bukrs,
      budat: formatSapDate(entry.Budat),
      bldat: formatSapDate(entry.Bldat),
      blart: entry.Blart,
      wrbtr: entry.Wrbtr,
      waers: entry.Waers,
      shkzg: entry.Shkzg,
      lifnr: entry.Lifnr
    });

const creditMemos = results
  .filter(e => String(e.Shkzg).trim().toUpperCase() === 'H')
  .map(formatEntry);

const debitMemos = results
  .filter(e => String(e.Shkzg).trim().toUpperCase() === 'S')
  .map(formatEntry);


    res.json({
      credit: creditMemos,
      debit: debitMemos
    });

  } catch (error) {
    console.error('Error fetching vendor credit/debit memos:', error.message);
    res.status(500).json({ error: 'Failed to fetch vendor data' });
  }
});
module.exports = router;