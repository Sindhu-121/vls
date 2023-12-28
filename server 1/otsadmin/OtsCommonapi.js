const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/subjects', async (req, res) => {
    // Fetch subjects
    try {
      const [rows] = await db.query('SELECT * FROM subjects');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });  

  module.exports = router;