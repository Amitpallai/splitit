import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  appearance: { type: String, default: 'light' }, // e.g., 'light' or 'dark'
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);