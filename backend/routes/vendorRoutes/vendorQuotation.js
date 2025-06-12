const express = require('express');
const axios = require('axios');
const router = express.Router();

const SAP_VRFQ_URL = process.env.SAP_VRFQ_URL; // e.g. /sap/opu/odata/sap/ZSEGW_MM_VENDORDETAILST_SRV/ZRFQHeaderSet
const SAP_USERNAME = process.env.SAP_USERNAME;
const SAP_PASSWORD = process.env.SAP_PASSWORD;

const SAP_AUTH = 'Basic ' + Buffer.from(`${SAP_USERNAME}:${SAP_PASSWORD}`).toString('base64');

// Convert SAP /Date(...) format to dd-mm-yyyy
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

router.get('/VQuotation/:vendorId', async (req, res) => {
  const { vendorId } = req.params;
  const odataUrl = `${SAP_VRFQ_URL}?$filter=Lifnr eq '${vendorId}'&$expand=ToRFQItems`;

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
      ekorg: header.Ekorg,
      ekgrp: header.Ekgrp,
      waers: header.Waers,
      items: (header.ToRFQItems?.results || []).map(item => ({
        ebeln: item.Ebeln,
        ebelp: item.Ebelp,
        matnr: item.Matnr,
        meins: item.Meins
      }))
    }));

    res.json(transformed);
  } catch (error) {
    console.error('Error fetching RFQ data:', error.message);
    res.status(500).json({ error: 'Failed to fetch RFQ data' });
  }
});

module.exports = router;
