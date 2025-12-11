const Patient = require('../models/Patient.model');

// Отримати всіх пацієнтів
const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

// Створити нового пацієнта
const createPatient = async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    const savedPatient = await newPatient.save();
    res.status(201).json(savedPatient);
  } catch (error) {
    res.status(400).json({ message: 'Не вдалося створити пацієнта', error: error.message });
  }
};

// Отримати одного пацієнта по ID
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Пацієнта не знайдено' });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

// Оновити пацієнта
const updatePatient = async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Повертає оновлений документ
    );
    if (!updatedPatient) {
      return res.status(404).json({ message: 'Пацієнта не знайдено' });
    }
    res.status(200).json(updatedPatient);
  } catch (error) {
    res.status(400).json({ message: 'Не вдалося оновити', error: error.message });
  }
};

// Видалити пацієнта
const deletePatient = async (req, res) => {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
    if (!deletedPatient) {
      return res.status(404).json({ message: 'Пацієнта не знайдено' });
    }
    res.status(200).json({ message: 'Patient deleted', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

module.exports = {
  getPatients,
  createPatient,
  getPatientById,
  updatePatient,
  deletePatient,
};