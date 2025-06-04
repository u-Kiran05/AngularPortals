const express = require('express');
const router = express.Router();
const { callSapService } = require("../../utils/parser");

router.post('/customerbi', async (req, res) => {
    const { customerId } = req.body;
   // console.log('Request body:', req.body);

    if (!customerId) {
        return res.status(400).json({ success: false, message: 'Customer ID is required.' });
    }

    const soapEnvelope = `
        <soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"
                           xmlns:urn="urn:sap-com:document:sap:rfc:functions">
          <soap-env:Header/>
          <soap-env:Body>
            <urn:ZFM_CBI>
              <I_CUSTOMER_ID>${customerId}</I_CUSTOMER_ID>
            </urn:ZFM_CBI>
          </soap-env:Body>
        </soap-env:Envelope>`;

    try {
        const rfcResponse = await callSapService({
            url: process.env.SAP_CBI_URL?.trim(),
            soapEnvelope,
            soapAction: 'urn:sap-com:document:sap:rfc:functions:ZFM_CBI',
            rfcFunction: 'ZFM_CBI'
        });

        const parseTable = (table, fields) => {
            return (table?.[0]?.item || []).map(item =>
                Object.fromEntries(fields.map(f => [f, item[f]?.[0] || '']))
            );
        };

        res.json({
            success: true,
            data: {
                aging: parseTable(rfcResponse.ES_AGING, ['VBELN', 'FKDAT', 'DUE_DT', 'NETWR', 'WAERK', 'AGEING_DAYS']),
                credit: parseTable(rfcResponse.ES_CREDIT, ['VBELN', 'FKART', 'FKTYP', 'FKDAT', 'VBTYP', 'NETWR', 'WAERK', 'POSNR', 'MATNR', 'KNUMV', 'KIDNO', 'ERZET', 'ERDAT', 'VKORG']),
                debit: parseTable(rfcResponse.ES_DEBIT, ['VBELN', 'FKART', 'FKTYP', 'FKDAT', 'VBTYP', 'NETWR', 'WAERK', 'POSNR', 'MATNR', 'KNUMV', 'KIDNO', 'ERZET', 'ERDAT', 'VKORG']),
                deliveryHeader: parseTable(rfcResponse.ES_DELIVERY_H, ['VBELN', 'ERDAT', 'LFDAT', 'VSTEL', 'ROUTE', 'WAERK']),
                deliveryItems: parseTable(rfcResponse.ES_DELIVERY_I, ['VBELN', 'POSNR', 'MATNR', 'ARKTX', 'LFIMG']),
                inquiryHeader: parseTable(rfcResponse.ES_INQUIRY_H, ['VBELN', 'ERDAT', 'AUART', 'ANGDT', 'BNDDT']),
                inquiryItems: parseTable(rfcResponse.ES_INQUIRY_I, ['VBELN', 'POSNR', 'MATNR', 'ARKTX', 'KWMENG', 'VRKME']),
                invoiceHeader: parseTable(rfcResponse.ES_INVOICE_H, ['VBELN', 'FKDAT', 'NETWR', 'WAERK', 'ERDAT', 'BUKRS']),
                invoiceItems: parseTable(rfcResponse.ES_INVOICE_I, ['VBELN', 'POSNR', 'MATNR', 'ARKTX', 'FKIMG', 'VRKME', 'NETWR']),
                salesHeader: parseTable(rfcResponse.ES_SALES_H, ['VBELN', 'AUART', 'ERDAT', 'WAERK', 'NETWR']),
                salesItems: parseTable(rfcResponse.ES_SALES_I, ['POSNR', 'MATNR', 'ARKTX', 'NETWR', 'KWMENG', 'VRKME', 'VBELN', 'WAERK'])
            }
        });
    } catch (error) {
        console.error('CUSTOMER BI ERROR:', error.message);
        res.status(500).json({
            success: false,
            message: 'SAP customer BI call failed',
            error: error.message
        });
    }
});

module.exports = router;
