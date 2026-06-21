const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String, required: true },
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  isPreview: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
});

module.exports = mongoose.model('Lesson', lessonSchema);
