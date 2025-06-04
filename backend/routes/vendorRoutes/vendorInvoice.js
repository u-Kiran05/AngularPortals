const express = require('express');
const axios = require('axios');
const router = express.Router();

const SAP_VINV_URL = process.env.SAP_VINV_URL; 
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

router.get('/Vinvoice/:vendorId', async (req, res) => {
  const { vendorId } = req.params;
  const odataUrl = `${SAP_VINV_URL}?$filter=Lifnr eq '${vendorId}'&$expand=ToINVItems`;

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
      belnr: header.Belnr,
      gjahr: header.Gjahr,
      bukrs: header.Bukrs,
      lifnr: header.Lifnr,
      budat: formatSapDate(header.Budat),
      bldat: formatSapDate(header.Bldat),
      rmwwr: header.Rmwwr-80,
      waers: header.Waers,
      items: (header.ToINVItems?.results || []).map(item => ({
        ebeln: item.Ebeln,
        ebelp: item.Ebelp,
        matnr: item.Matnr,
        maktx: item.Maktx,
        menge: item.Menge,
        meins: item.Meins,
        wrbtr: item.Wrbtr,
        waers: item.Waers,
        bstme: item.Bstme
      }))
    }));

    res.json(transformed);

  } catch (error) {
    console.error('Error fetching invoice data:', error.message);
    res.status(500).json({ error: 'Failed to fetch vendor invoice data' });
  }
});

module.exports = router;
