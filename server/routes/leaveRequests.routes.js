const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticate = require('../middleware/file-1');
const authorize = require('../middleware/role');

// APPLY
router.post('/', authenticate, authorize('employee'), async (req, res) => {
  const { leave_type_id, from_date, to_date, reason } = req.body;
  const employee_id = req.user.id;

  const days = Math.ceil((new Date(to_date) - new Date(from_date)) / 86400000) + 1;
  const year = new Date(from_date).getFullYear();

  const [bal] = await pool.query(
    'SELECT * FROM leave_balances WHERE employee_id=? AND leave_type_id=? AND year=?',
    [employee_id, leave_type_id, year]
  );

  if (!bal.length || bal[0].used_days + days > bal[0].total_days)
    return res.status(400).json({ message: 'Insufficient leave balance' });

  const [result] = await pool.query(
    'INSERT INTO leave_requests (employee_id,leave_type_id,from_date,to_date,reason) VALUES (?,?,?,?,?)',
    [employee_id, leave_type_id, from_date, to_date, reason || '']
  );

  res.json({ id: result.insertId });
});

// APPROVE
router.put('/:id/approve', authenticate, authorize('manager','admin'), async (req, res) => {
  await pool.query(
    'UPDATE leave_requests SET status="approved", approved_by=? WHERE id=?',
    [req.user.id, req.params.id]
  );
  res.json({ message: 'approved' });
});

// REJECT
router.put('/:id/reject', authenticate, authorize('manager','admin'), async (req, res) => {
  await pool.query(
    'UPDATE leave_requests SET status="rejected", approved_by=? WHERE id=?',
    [req.user.id, req.params.id]
  );
  res.json({ message: 'rejected' });
});

// CANCEL
router.delete('/:id', authenticate, authorize('employee'), async (req, res) => {
  await pool.query('DELETE FROM leave_requests WHERE id=?', [req.params.id]);
  res.json({ message: 'cancelled' });
});

module.exports = router;