const express = require('express');
const axios = require('axios');
const router = express.Router();

const SAP_VINVPDF_URL =  process.env.SAP_VINVPDF_URL;
const SAP_USERNAME = process.env.SAP_USERNAME;
const SAP_PASSWORD = process.env.SAP_PASSWORD;

const SAP_AUTH = 'Basic ' + Buffer.from(`${SAP_USERNAME}:${SAP_PASSWORD}`).toString('base64');

router.get('/vinvpdf/:lifnr/:belnr', async (req, res) => {
  const { lifnr, belnr } = req.params;
  const pdfUrl = `${SAP_VINVPDF_URL}(Lifnr='${lifnr}',Belnr='${belnr}')/$value`;

  try {
    const response = await axios.get(pdfUrl, {
      responseType: 'arraybuffer',
      headers: {
        'Authorization': SAP_AUTH,
        'Accept': 'application/pdf',
        'Cookie': 'sap-usercontext=sap-client=100'
      }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Invoice_${belnr}.pdf`);
    res.send(response.data);
  } catch (error) {
    console.error('PDF fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch invoice PDF' });
  }
});

module.exports = router;
