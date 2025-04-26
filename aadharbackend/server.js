const app = require('./app');
const http = require('http');

// Set port
const PORT = process.env.PORT || 4505;

// Create HTTP server
const server = http.createServer(app);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle uncaught exceptions to prevent immediate shutdown
process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down gracefully...');
  console.error(error.name, error.message);
  console.error(error.stack);
  
  // Close server gracefully and exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down gracefully...');
  console.error(error.name, error.message);
  
  // Close server gracefully and exit process
  server.close(() => {
    process.exit(1);
  });
});