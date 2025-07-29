import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /.+@.+\..+/ },
    password: { type: String, required: true },
  },
  {
    timestamps: true, // додає createdAt і updatedAt автоматично
  }
);

const User = mongoose.model('User', userSchema);
export default User;
