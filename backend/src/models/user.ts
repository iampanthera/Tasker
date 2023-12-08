const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^\S+@\S+\.\S+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);
