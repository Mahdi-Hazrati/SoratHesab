const express = require('express');
const bodyParser = require('body-parser');
const invoicesRouter = require('./routes/invoices');

const app = express();
const port = 3001;

app.use(bodyParser.json());

app.use('/', invoicesRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
