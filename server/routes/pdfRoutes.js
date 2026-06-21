const express = require('express');
const router = express.Router();
const { getPDFs, getPDFDetails, createPDF, updatePDF, deletePDF } = require('../controllers/pdfController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getPDFs);
router.get('/:id', getPDFDetails);
router.post('/', protect, admin, createPDF);
router.put('/:id', protect, admin, updatePDF);
router.delete('/:id', protect, admin, deletePDF);

module.exports = router;
