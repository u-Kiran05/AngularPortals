const express = require('express');
const router = express.Router();
const { callSapService } = require("D:\\PortalProject\\backend\\utils\\parser.js");
//const redisClient = require('D:\\PortalProject\\backend\\utils\\redisClient.js');

router.post('/login', async (req, res) => {
  const { customerId, password } = req.body;

  if (!customerId || !password) {
    return res.status(400).json({ success: false, message: 'Customer ID and password are required.' });
  }

  const soapEnvelope = `
    <soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"
                       xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soap-env:Header/>
      <soap-env:Body>
        <urn:ZFM_CUSTOMER_LOGIN_VALIDATE>
          <I_CUSTOMER_ID>${customerId}</I_CUSTOMER_ID>
          <I_PASSWORD>${password}</I_PASSWORD>
        </urn:ZFM_CUSTOMER_LOGIN_VALIDATE>
      </soap-env:Body>
    </soap-env:Envelope>`;

  try {
    const rfcResponse = await callSapService({
      url: process.env.SAP_CLOGIN_URL?.trim(),
      soapEnvelope,
      soapAction: 'urn:sap-com:document:sap:rfc:functions:ZFM_CUSTOMER_LOGIN_VALIDATE',
      rfcFunction: 'ZFM_CUSTOMER_LOGIN_VALIDATE'
    });

    const message = rfcResponse.E_MESSAGE?.[0] || 'Unknown';
    const valid = rfcResponse.E_VALID?.[0] === 'Y';

    if (valid) {
      const sessionData = {
        id: customerId,
        loginTime: new Date()
      };

      /*req.session.customer = sessionData;

      try {
        await redisClient.setEx(`session:${customerId}`, 3600, JSON.stringify(sessionData));
        console.log(`Redis setEx success for session:${customerId}`);
      } catch (redisError) {
        console.error('Redis setEx error:', redisError.message);
        return res.status(500).json({
          success: false,
          message: 'Failed to store session in Redis',
          error: redisError.message
        });
      }

      // Debug session store
      console.log('Session data set:', req.session.customer);
      console.log('Session ID:', req.sessionID);*/

      return res.json({ success: true, message });
    } else {
      return res.json({ success: false, message });
    }

  } catch (error) {
    console.error('LOGIN ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: 'SAP call failed',
      error: error.message
    });
  }
});

module.exports = router;