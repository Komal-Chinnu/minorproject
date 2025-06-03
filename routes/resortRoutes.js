const express = require('express');
const {
  getAllResorts,
  createResort,
  getResortById,
  updateResort,
  deleteResort,
  searchResorts,
} = require('../controllers/resortController');

const router = express.Router();

// Search resorts by destination or name
router.get('/search', searchResorts);

// Resort CRUD operations
router.get('/', getAllResorts);
router.post('/', createResort);
router.get('/:id', getResortById);
router.put('/:id', updateResort);
router.delete('/:id', deleteResort);

module.exports = router;
