const express = require('express');
const router = express.Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const dataPath = './src/database/db.json';

// Read all invoices
router.get('/', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new invoice
router.post('/', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const newInvoice = { ...req.body, id: uuidv4() };
    data.push(newInvoice);
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update an existing invoice
router.put('/:id', (req, res) => {
  try {
    const id = req.params.id;
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const updatedInvoice = { ...req.body, id };
    const index = data.findIndex((invoice) => invoice.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    data[index] = updatedInvoice;
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    res.json(updatedInvoice);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete an invoice
router.delete('/:id', (req, res) => {
  try {
    const id = req.params.id;
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const index = data.findIndex((invoice) => invoice.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    data.splice(index, 1);
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
