const Course = require('../models/Course');
const User = require('../models/User');
const Payment = require('../models/Payment');
const PDFProduct = require('../models/PDFProduct');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalStudents = await User.countDocuments({ role: 'user' });
    const totalCourses = await Course.countDocuments();
    const totalPDFs = await PDFProduct.countDocuments();
    const totalOrders = await Payment.countDocuments({ status: 'success' });

    const recentPayments = await Payment.find({ status: 'success' })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
     .limit(5);

    res.json({
      revenue: totalRevenue[0]?.total || 0,
      students: totalStudents,
      courses: totalCourses,
      pdfs: totalPDFs,
      orders: totalOrders,
      recentPayments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
