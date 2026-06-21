const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getAllPayments } = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/', protect, admin, getAllPayments);

module.exports = router;
