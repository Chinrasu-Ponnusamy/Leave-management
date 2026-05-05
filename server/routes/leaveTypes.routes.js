const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticate = require('../middleware/file-1');
const authorize = require('../middleware/role');

router.get('/', authenticate, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM leave_types');
  res.json(rows);
});

router.post('/', authenticate, authorize('admin'), async (req, res) => {
  const { type_name, max_days_per_year } = req.body;

  const [result] = await pool.query(
    'INSERT INTO leave_types (type_name, max_days_per_year) VALUES (?,?)',
    [type_name, max_days_per_year]
  );

  res.json({ id: result.insertId, type_name, max_days_per_year });
});

module.exports = router;