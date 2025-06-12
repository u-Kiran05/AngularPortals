const express = require('express');
const axios = require('axios');
const router = express.Router();

const SAP_VGR_URL = process.env.SAP_VGR_URL; 
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

// Endpoint: /VGRReport/:vendorId
router.get('/VGoods/:vendorId', async (req, res) => {
  const { vendorId } = req.params;
  const odataUrl = `${SAP_VGR_URL}?$filter=Lifnr eq '${vendorId}'&$format=json`;

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

    const transformed = results.map(gr => ({
      mblnr: gr.Mblnr,
      mjahr: gr.Mjahr,
      ebeln: gr.Ebeln,
      ebelp: gr.Ebelp,
      matnr: gr.Matnr,
      menge: gr.Menge,
      werks: gr.Werks,
      budat: formatSapDate(gr.Budat),
     // bldat: formatSapDate(gr.Bldat),
      waers: gr.Waers,
      meins: gr.Meins,
      lifnr: gr.Lifnr,
      bwart: gr.Bwart
    }));

    res.json(transformed);
  } catch (error) {
    console.error('Error fetching GR data:', error.message);
    res.status(500).json({ error: 'Failed to fetch Goods Receipt data' });
  }
});

module.exports = router;
