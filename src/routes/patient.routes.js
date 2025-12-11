const express = require('express');
const router = express.Router();
const {
  getPatients,
  createPatient,
  getPatientById,
  updatePatient,
  deletePatient,
} = require('../controllers/patient.controller');

// Маршрути для пацієнтів
router.get('/', getPatients); // GET /api/patients
router.post('/', createPatient); // POST /api/patients
router.get('/:id', getPatientById); // GET /api/patients/123
router.put('/:id', updatePatient); // PUT /api/patients/123
router.delete('/:id', deletePatient); // DELETE /api/patients/123

module.exports = router;