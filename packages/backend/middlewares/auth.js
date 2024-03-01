import jwt from 'jsonwebtoken';
import { asyncWrapper } from '../utils/utils.js';
import User from '../models/user.js';

export const authenticateUser = asyncWrapper(async (req, res, next) => {
  const token = req.header('Authorization') ?? req.body.token
  let error = false
  if (!token) {
    error = true
  } else {
    jwt.verify(token, process.env.JWT_TOKEN_KEY, (err, decoded) => {
      error = !!err || decoded.exp * 1000 - Date.now() <= 0
    })
  }

  if (error) {
    res.status(401).json({ status: 0, message: 'Invalid token.' })
    return
  }

  try {
    const user = await User.findOne({ token })
    if (!user) {
      res.status(401).json({ status: 0, message: 'Invalid Token.' })
      return
    }
    res.locals.user = user
    next()
  } catch (err) {
    res.status(400).json({ status: 0, message: 'Something went wrong.' })
  }
})

export const adminProtected = (req, res, next) => {
  const {user} = res.locals;
  if (user.role !== 'admin') {
    res.status(401).json({ status: 0, message: 'Not Allowed' })
    return;
  }
  next()
}