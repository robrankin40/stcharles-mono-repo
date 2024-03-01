import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import { sanitizeEmail } from '../utils/user.js';

const { Schema } = mongoose;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  inviteCode: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
    select: false,
    length: 60,
    unique: false,
  },
  token: {
    type: String,
    required: false,
  }
}, {
  timestamp: true
});

UserSchema.method('validatePassword', async function (data) {
  return new Promise(async (res, rej) => {
    try {
      const user = await User.findOne({email: this.email})
        .select('password') 
      const result = bcrypt.compareSync(data, user.password)
      res(result)
    } catch (err) {
      console.log(err)
      rej(err)
    }
  })
})

UserSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next()
  try {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt)
    this.email = sanitizeEmail(this.email)
    return next();
  } catch (err) {
    return next(err);
  }
})

const User = mongoose.model('User', UserSchema)

export default User