import express from 'express';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';
import { generatePassword, sanitizeEmail } from '../utils/user.js';

const router = express.Router();

// Define a route
router.post('/login', async (req, res, next) => {
  const {email, password} = req.body
  try {
    const user = await User.findOne({ email: sanitizeEmail(email) })
    if (user && (user.status === 'active' || user.status === 'password-generated')) {
      const isPasswordValid = await user.validatePassword(password)
      if (isPasswordValid) {
        const token = jwt.sign({ sub: user.id }, process.env.JWT_TOKEN_KEY, {
          expiresIn: '7d'
        });
        user.token = token;
        await user.save()
        res.status(200).json({
          status: 1,
          message: 'Authentication success',
          data: user
        });
      } else {
        res.status(400).json({ status: 0, message: "Password doesn't match" });
      }
    } else if ( user && (user.status === 'created' || user.status === 'deactivated')) {
      res.status(400).json({ status: 0, message: "User is not active"});
    } else {
      res.status(400).json({ status: 0, message: "User not found."});
    }
  } catch (err) {
    res.status(400).json({ status: 0, message: 'Something went wrong.' });
  }
});

router.post('/join', async (req, res) => {
  const { email, inviteCode } = req.body;
  try {
    const user = await User.findOne({email: sanitizeEmail(email), inviteCode});
    if (user) {
      if (user.status === 'active') {
        return res.status(401).json({ status: 0, message: 'You already finish setup your account.' })
      }
      if (user.status === 'password-generated') {
        return res.status(401).json({ status: 0, message: 'New password assigned and sent to you.' })
      }
      const newPassword = generatePassword(10);
      user.status = 'password-generated';
      user.password = newPassword;
      await user.save()
      return res.status(200).json({ status: 1, password: newPassword });
    }
    return res.status(404).json({ status: 0, message: 'User not found or invite code invalid' })
  } catch (error) {
    console.log('joining error')
    console.log(error)
    res.status(500).json({error})
  }
});

export default router;
