const express = require('express');
const { requireFirebaseAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', requireFirebaseAuth, async (req, res) => {
  console.log('AUDIT_EVENT', {
    userId: req.user.uid,
    action: req.body.action,
    incidentId: req.body.incidentId,
    timestamp: new Date().toISOString()
  });
  res.status(201).json({ ok: true });
});

module.exports = router;
