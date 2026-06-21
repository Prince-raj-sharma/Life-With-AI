const express = require('express');
const router = express.Router();
const { getCoupons, createCoupon, deleteCoupon, validateCoupon } = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getCoupons);
router.post('/', protect, admin, createCoupon);
router.delete('/:id', protect, admin, deleteCoupon);
router.get('/validate/:code', protect, validateCoupon);

module.exports = router;
