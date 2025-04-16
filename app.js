// app.js
require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes');
const cors = require('cors');


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/', routes);


// Start server
const PORT = process.env.PORT || 3000;


// Test server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}


module.exports = app;