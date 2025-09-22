// Import the existing server from Backend
const app = require('../Backend/server.js');

// For Vercel, we need to export the app as a serverless function
module.exports = app;

