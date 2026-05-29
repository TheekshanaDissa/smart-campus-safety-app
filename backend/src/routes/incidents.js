const express = require('express');
const { requireFirebaseAuth } = require('../middleware/auth');
const repository = require('../repositories/incidentRepository');

const router = express.Router();

router.use(requireFirebaseAuth);

router.get('/', async (req, res, next) => {
  try {
    const items = await repository.listIncidents();
    res.json({ data: items });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, description, category, severity, location, photoUri } = req.body;
    if (!title || !description || !category || !severity) {
      return res.status(400).json({ error: 'title, description, category and severity are required.' });
    }

    const incident = await repository.createIncident({
      title,
      description,
      category,
      severity,
      location: location || null,
      photoUri: photoUri || null,
      userId: req.user.uid,
      reporterEmail: req.user.email || null
    });

    res.status(201).json({ data: incident });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['submitted', 'reviewing', 'resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }
    const result = await repository.updateIncidentStatus(req.params.id, status);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
