const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const verifyToken = require('./middleware/verifyToken')

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Customer route imports
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

// Vendor route imports
const vendorLoginRoute = require('./routes/vendorRoutes/vendorLogin');
const vendorProfileRoute = require('./routes/vendorRoutes/vendorProfile');
const vendorPurchase = require('./routes/vendorRoutes/vendorPurchase');
const vendorQuotation = require('./routes/vendorRoutes/vendorQuotation');
const vendorGoods = require('./routes/vendorRoutes/vendorGoods');
const vendorInvoice =require('./routes/vendorRoutes/vendorInvoice');
const vendorInvoicePdf =require('./routes/vendorRoutes/vendorInvoicePdf');
const vendorAging=require('./routes/vendorRoutes/vendorAging');
const vendorCandD=require('./routes/vendorRoutes/vendorCandD');
const vendorBI=require('./routes/vendorRoutes/vendorBI');

//Employee route imports
const employeeLoginRoute=require('./routes/employeeRoutes/employeeLogin');
const employeeProfileRoute = require('./routes/employeeRoutes/employeeProfile');
const employeeLeaveRoute = require('./routes/employeeRoutes/employeeLeave');
const employeepayPDF = require('./routes/employeeRoutes/employeePayPDF');
const employeepay = require('./routes/employeeRoutes/employeePay');

// Public login routes (no token needed)
app.use('/api/customer', customerLoginRoute);
app.use('/api/vendor', vendorLoginRoute);
app.use('/api/employee', employeeLoginRoute);


//employee protected routes (requires role: employee)
app.use('/api/employee',verifyToken('Employee'), employeeProfileRoute);
app.use('/api/employee',verifyToken('Employee'), employeeLeaveRoute);
app.use('/api/employee',verifyToken('Employee'), employeepayPDF);
app.use('/api/employee',verifyToken('Employee'), employeepay);
// Vendor protected routes (requires role: Vendor)
app.use('/api/vendor', verifyToken('Vendor'), vendorProfileRoute);
app.use('/api/vendor', verifyToken('Vendor'), vendorPurchase);
app.use('/api/vendor', verifyToken('Vendor'), vendorQuotation);
app.use('/api/vendor', verifyToken('Vendor'), vendorGoods);
app.use('/api/vendor', verifyToken('Vendor'), vendorInvoicePdf);
app.use('/api/vendor', verifyToken('Vendor'), vendorInvoice);
app.use('/api/vendor', verifyToken('Vendor'), vendorAging);
app.use('/api/vendor', verifyToken('Vendor'), vendorCandD);
app.use('/api/vendor', verifyToken('Vendor'), vendorBI);
// Customer protected routes (requires role: Customer)
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

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found', path: req.path });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
