#!/usr/bin/env node

// Set environment variables for Replit compatibility
process.env.HOST = '0.0.0.0';
process.env.PORT = '5000';
process.env.NODE_ENV = 'development';

// Import and start the server
import('./server/index.js');