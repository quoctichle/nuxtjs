import { connectDB } from './mongodb'
import mongoose from 'mongoose'

const SpinCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  fb: String,
  cid: String,
  email: String,
  prize: String,
}, { timestamps: true })

const SpinCode = mongoose.models.SpinCode || mongoose.model('SpinCode', SpinCodeSchema)

export default defineEventHandler(async (event) => {
  await connectDB()
  const code = event.context.params.code
  const doc = await SpinCode.findOne({ code })
  return { success: !!doc, data: doc }
})
