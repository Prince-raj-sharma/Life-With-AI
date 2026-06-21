const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Notification = require('../models/Notification');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  const { amount, productId, productType } = req.body;
  try {
    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    
    // Create pending payment record
    await Payment.create({
      razorpayOrderId: order.id,
      user: req.user._id,
      product: productId,
      productType,
      amount,
      status: 'pending'
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature === expectedSign) {
    // Payment verified
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (payment) {
      payment.status = 'success';
      payment.razorpayPaymentId = razorpay_payment_id;
      payment.razorpaySignature = razorpay_signature;
      await payment.save();

      // Unlock product for user
      const user = await User.findById(payment.user);
      if (payment.productType === 'course') {
        user.purchasedCourses.push(payment.product);
      } else {
        user.purchasedPDFs.push(payment.product);
      }
      await user.save();

      // Create Notification
      await Notification.create({
        user: user._id,
        title: 'Payment Successful',
        message: `Your purchase for ${payment.productType} was successful!`
      });

      res.json({ message: "Payment verified successfully" });
    } else {
      res.status(404).json({ message: "Payment record not found" });
    }
  } else {
    res.status(400).json({ message: "Invalid signature" });
  }
};

exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('user').sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
