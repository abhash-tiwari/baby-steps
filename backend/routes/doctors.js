const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// Apply authentication middleware to all routes
router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctor);
router.post('/', doctorController.createDoctor);
router.get('/:id/slots', doctorController.getAvailableSlots);

module.exports = router;
