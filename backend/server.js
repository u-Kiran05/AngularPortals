const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const customerLoginRoute = require('./routes/customerRoutes/customerLogin');
const customerProfileRoute = require('./routes/customerRoutes/customerProfile');
const customerSalesRoute=require('./routes/customerRoutes/customerSales')
const customerInquiryRoute=require('./routes/customerRoutes/customerInquiry')
// Use routes
app.use('/api/customer', customerLoginRoute);
app.use('/api/customer', customerProfileRoute); 
app.use('/api/customer', customerSalesRoute);
app.use('/api/customer', customerInquiryRoute);
// Default 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found', path: req.path });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
