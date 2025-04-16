const express = require('express');
const router = express.Router();
const uploadController = require('./uploadController');
const cors = require('cors');

// CORS configuration to allow requests from your Shopify domain
const corsOptions = {
  origin: 'https://https://1dfc55-2.myshopify.com',
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS middleware to the upload route
router.post('/upload', cors(corsOptions), uploadController.uploadImage);

module.exports = router;