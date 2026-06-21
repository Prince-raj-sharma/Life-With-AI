const Coupon = require('../models/Coupon');

exports.getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.status(201).json(coupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCoupon = async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ message: 'Coupon deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.validateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ code: req.params.code, isActive: true });
        if (coupon && new Date(coupon.expiryDate) > new Date()) {
            res.json(coupon);
        } else {
            res.status(400).json({ message: 'Invalid or expired coupon' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
