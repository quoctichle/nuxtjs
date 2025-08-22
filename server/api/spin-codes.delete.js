import { connectDB } from './mongodb';
import mongoose from 'mongoose';

const SpinCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  fb: String,
  cid: String,
  email: String,
  prize: String,
}, { timestamps: true });

const SpinCode = mongoose.models.SpinCode || mongoose.model('SpinCode', SpinCodeSchema);

export default defineEventHandler(async (event) => {
  await connectDB();
  // Xoá toàn bộ mã quay
  await SpinCode.deleteMany({});
  // Xoá toàn bộ dữ liệu người chơi (nếu có collection User hoặc SpinHistory)
  try {
    const User = mongoose.model('User');
    await User.deleteMany({});
  } catch (e) {}
  try {
    const SpinHistory = mongoose.model('SpinHistory');
    await SpinHistory.deleteMany({});
  } catch (e) {}
  return {
    success: true
  };
});
