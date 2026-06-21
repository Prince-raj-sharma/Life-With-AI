const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  mobile: { type: String },
  profilePhoto: { type: String, default: 'https://res.cloudinary.com/di93b92ow/image/upload/v1631525257/default-avatar.png' },
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  purchasedPDFs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PDFProduct' }],
  isBlocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
