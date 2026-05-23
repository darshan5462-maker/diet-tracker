const express = require('express');
const router = express.Router();
const { getPatients, getDoctors, getPatientDetails, assignDoctor } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/patients', authorize('doctor', 'admin'), getPatients);
router.get('/doctors', getDoctors);
router.get('/patients/:id', authorize('doctor', 'admin'), getPatientDetails);
router.post('/assign-doctor', authorize('admin'), assignDoctor);

module.exports = router;
