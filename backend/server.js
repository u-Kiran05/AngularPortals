const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
//const cron = require('node-cron');
const verifyToken = require('./middleware/verifyToken');
const { checkSAPHealth, getSAPStatus } = require('./utils/sapHealthChecker');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ------------------ SAP Health Check ------------------
checkSAPHealth();
//cron.schedule('* * * * *', checkSAPHealth);
setInterval(checkSAPHealth, 5000);

app.get('/api/sap-status', (req, res) => {
  res.json(getSAPStatus());
});

// ------------------ Chat bot ------------------

//const { startPythonNlpServer } = require('./utils/startPythonNlpServer');
//startPythonNlpServer();
const transformerRoute = require('./routes/commonRoutes/transformerRoute');
app.use('/api/transformer-nlp', transformerRoute);



  // ------------------ Customer Routes ------------------
  const customerLoginRoute = require('./routes/customerRoutes/customerLogin');
  const customerProfileRoute = require('./routes/customerRoutes/customerProfile');
  const customerSalesRoute = require('./routes/customerRoutes/customerSales');
  const customerInquiryRoute = require('./routes/customerRoutes/customerInquiry');
  const customerDeliveryRoute = require('./routes/customerRoutes/customerDelivery');
  const customerInvoiceRoute = require('./routes/customerRoutes/customerInvoice');
  const customerCandDRoute = require('./routes/customerRoutes/customerCandD');
  const customerAgingRoute = require('./routes/customerRoutes/customerAging');
  const customerInvoiceDownloadRoute = require('./routes/customerRoutes/customerInvoicePDF');
  const customerOverallsales = require('./routes/customerRoutes/customerOvasales');
  const customerBI = require('./routes/customerRoutes/customerBI');

  // ------------------ Vendor Routes ------------------
  const vendorLoginRoute = require('./routes/vendorRoutes/vendorLogin');
  const vendorProfileRoute = require('./routes/vendorRoutes/vendorProfile');
  const vendorPurchase = require('./routes/vendorRoutes/vendorPurchase');
  const vendorQuotation = require('./routes/vendorRoutes/vendorQuotation');
  const vendorGoods = require('./routes/vendorRoutes/vendorGoods');
  const vendorInvoice = require('./routes/vendorRoutes/vendorInvoice');
  const vendorInvoicePdf = require('./routes/vendorRoutes/vendorInvoicePdf');
  const vendorAging = require('./routes/vendorRoutes/vendorAging');
  const vendorCandD = require('./routes/vendorRoutes/vendorCandD');
  const vendorBI = require('./routes/vendorRoutes/vendorBI');

  // ------------------ Employee Routes ------------------
  const employeeLoginRoute = require('./routes/employeeRoutes/employeeLogin');
  const employeeProfileRoute = require('./routes/employeeRoutes/employeeProfile');
  const employeeLeaveRoute = require('./routes/employeeRoutes/employeeLeave');
  const employeepayPDF = require('./routes/employeeRoutes/employeePayPDF');
  const employeepay = require('./routes/employeeRoutes/employeePay');
  const employeeMail = require('./utils/mailSender');
  const employeeKpi = require('./routes/employeeRoutes/employeeKPI');

  // ------------------ Public Routes (No Token Required) ------------------
  app.use('/api/customer', customerLoginRoute);
  app.use('/api/vendor', vendorLoginRoute);
  app.use('/api/employee', employeeLoginRoute);
  app.use('/api/transformer-nlp', transformerRoute);

  // ------------------ Protected Employee Routes ------------------
  app.use('/api/employee', verifyToken('Employee'), employeeProfileRoute);
  app.use('/api/employee', verifyToken('Employee'), employeeLeaveRoute);
  app.use('/api/employee', verifyToken('Employee'), employeepayPDF);
  app.use('/api/employee', verifyToken('Employee'), employeepay);
  app.use('/api/employee', verifyToken('Employee'), employeeMail);
  app.use('/api/employee', verifyToken('Employee'), employeeKpi);

  // ------------------ Protected Vendor Routes ------------------
  app.use('/api/vendor', verifyToken('Vendor'), vendorProfileRoute);
  app.use('/api/vendor', verifyToken('Vendor'), vendorPurchase);
  app.use('/api/vendor', verifyToken('Vendor'), vendorQuotation);
  app.use('/api/vendor', verifyToken('Vendor'), vendorGoods);
  app.use('/api/vendor', verifyToken('Vendor'), vendorInvoicePdf);
  app.use('/api/vendor', verifyToken('Vendor'), vendorInvoice);
  app.use('/api/vendor', verifyToken('Vendor'), vendorAging);
  app.use('/api/vendor', verifyToken('Vendor'), vendorCandD);
  app.use('/api/vendor', verifyToken('Vendor'), vendorBI);

  // ------------------ Protected Customer Routes ------------------
  app.use('/api/customer', verifyToken('Customer'), customerProfileRoute);
  app.use('/api/customer', verifyToken('Customer'), customerSalesRoute);
  app.use('/api/customer', verifyToken('Customer'), customerInquiryRoute);
  app.use('/api/customer', verifyToken('Customer'), customerDeliveryRoute);
  app.use('/api/customer', verifyToken('Customer'), customerInvoiceRoute);
  app.use('/api/customer', verifyToken('Customer'), customerCandDRoute);
  app.use('/api/customer', verifyToken('Customer'), customerAgingRoute);
  app.use('/api/customer', verifyToken('Customer'), customerOverallsales);
  app.use('/api/customer', verifyToken('Customer'), customerInvoiceDownloadRoute);
  app.use('/api/customer', verifyToken('Customer'), customerBI);

  // ------------------ 404 Fallback ------------------
  app.use((req, res) => {
    res.status(404).json({ message: 'Not Found', path: req.path });
  });

  // ------------------ Start Server ------------------
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });

