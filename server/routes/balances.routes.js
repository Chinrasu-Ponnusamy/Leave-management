const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticate = require('../middleware/file-1');

router.get('/:employeeId', authenticate, async (req, res) => {
  const [rows] = await pool.query(
    `SELECT lb.*, lt.type_name
     FROM leave_balances lb
     JOIN leave_types lt ON lt.id = lb.leave_type_id
     WHERE lb.employee_id = ?`,
    [req.params.employeeId]
  );

  res.json(rows);
});

module.exports = router;