const express = require('express');
const axios = require('axios');
const router = express.Router();

const SAP_VBI_URL = process.env.SAP_VBI_URL; 
const SAP_USERNAME = process.env.SAP_USERNAME;
const SAP_PASSWORD = process.env.SAP_PASSWORD;

const SAP_AUTH = 'Basic ' + Buffer.from(`${SAP_USERNAME}:${SAP_PASSWORD}`).toString('base64');

router.get('/vbi/:vendorId', async (req, res) => {
  const { vendorId } = req.params;
  const odataUrl = `${SAP_VBI_URL}?$filter=Lifnr eq '${vendorId}'&$format=json`;

  try {
    const response = await axios.get(odataUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': SAP_AUTH,
        'Cookie': 'sap-usercontext=sap-client=100'
      }
    });

    const data = response.data?.d?.results?.[0];

    if (!data) {
      return res.status(404).json({ error: 'Vendor BI data not found' });
    }

    // Parse and format monthSpendJson
    let monthSpendJson = [];
    try {
      const parsed = JSON.parse(data.MonthSpendJson || '[]');
      if (Array.isArray(parsed)) {
        monthSpendJson = parsed.map(entry => {
          const rawMonth = String(entry.month || '');
          const formattedMonth = rawMonth.length === 6
            ? `${rawMonth.slice(0, 4)}-${rawMonth.slice(4)}`
            : rawMonth;

          return {
            month: formattedMonth,
            amount: Number(entry.amount) || 0
          };
        });
      }
    } catch (e) {
      console.warn('Invalid MonthSpendJson:', e.message);
    }

    const transformed = {
      lifnr: data.Lifnr,
      name: data.Name1,
      totalSpend: parseFloat(data.TotalSpend),
      totalPoCount: data.TotalPoCount,
      openPoCount: data.OpenPoCount,
      grDelayAvg: data.GrDelayAvg,
      creditTotal: parseFloat(data.CreditTotal),
      debitTotal: parseFloat(data.DebitTotal),
      avgAgingDays: data.AvgAgingDays,
      currency: data.Currency,
      avgSpendPerPo: parseFloat(data.AvgSpendPerPo),
      invoiceCount: data.InvoiceCount,
      avgInvoiceValue: parseFloat(data.AvgInvoiceValue),
      monthSpendJson
    };

    res.json(transformed);
  } catch (error) {
    console.error('Error fetching Vendor BI data:', error.message);
    res.status(500).json({ error: 'Failed to fetch Vendor BI data' });
  }
});
module.exports = router;