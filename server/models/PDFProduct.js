const mongoose = require('mongoose');

const pdfProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String },
  pdfFile: { type: String, required: true }, // Cloudinary URL
  canDownload: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PDFProduct', pdfProductSchema);
