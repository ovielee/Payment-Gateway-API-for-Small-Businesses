const app = require('./app'); // Import your Express app

// Set the port (use the environment variable PORT or default to 4000)
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
