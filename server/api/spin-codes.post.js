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
  const body = await readBody(event)
  // body: { code, fb, cid, email, prize }
  if (!body.code) return { error: 'Missing code' }
  let doc = await SpinCode.findOneAndUpdate(
    { code: body.code },
    { $set: body },
    { upsert: true, new: true }
  )
  return { success: true, data: doc }
})
