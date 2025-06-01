const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
//const session = require('express-session');
//const RedisStore = require('connect-redis')(session);

//const redisClient = require('./utils/redisClient');
// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
/*app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // 1 hour
  })
);*/
// Routes
const customerLoginRoute = require('./routes/customerRoutes/customerLogin');
const customerProfileRoute = require('./routes/customerRoutes/customerProfile');
const customerSalesRoute=require('./routes/customerRoutes/customerSales');
const customerInquiryRoute=require('./routes/customerRoutes/customerInquiry');
const customerDeliveryRoute=require('./routes/customerRoutes/customerDelivery');
const customerInvoiceRoute=require('./routes/customerRoutes/customerInvoice');
const customerCandDRoute=require('./routes/customerRoutes/customerCandD');
const customerAgingRoute=require('./routes/customerRoutes/customerAging');
const customerInvoiceDownloadRoute = require('./routes/customerRoutes/customerInvoicePDF')
const customerOverallsales=require('./routes/customerRoutes/customerOvasales')
const customerBI=require('./routes/customerRoutes/customerBI')
// Use routes

app.use('/api/customer', customerLoginRoute);
app.use('/api/customer', customerProfileRoute); 
app.use('/api/customer', customerSalesRoute);
app.use('/api/customer', customerInquiryRoute);
app.use('/api/customer', customerDeliveryRoute);
app.use('/api/customer', customerInvoiceRoute);
app.use('/api/customer', customerCandDRoute);
app.use('/api/customer', customerAgingRoute);
app.use('/api/customer', customerOverallsales);
app.use('/api/customer', customerInvoiceDownloadRoute);
app.use('/api/customer', customerBI);
// Default 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found', path: req.path });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
