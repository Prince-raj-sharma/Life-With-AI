const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  category: { type: String },
  thumbnail: { type: String },
  status: { type: String, enum: ['published', 'draft'], default: 'draft' },
  modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
  studentsEnrolled: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', courseSchema);
