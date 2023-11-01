const express = require('express');
const bodyParser = require('body-parser');
const invoicesRouter = require('./routes/invoices');
const cors = require('cors'); // Import the cors package

// Define ANSI escape codes for text color
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const app = express();
const port = 3001;
const path = "api"

app.use(cors()); // Enable CORS for all routes

app.use(bodyParser.json());

app.use(`/${path}`, invoicesRouter);

app.listen(port, () => {
  console.log(`${colors.yellow}Server is running on port ${port}  ${colors.reset}`);
  console.log(`${colors.green}Success: http://localhost:${port}/${path} ${colors.reset}`);
});
