import express from "express";

import { adminProtected, authenticateUser } from "../middlewares/auth.js";
import User from "../models/user.js";

const router = express.Router();

// Define a route
router.route('/').get(authenticateUser, adminProtected, async (req, res) => {
  try {
    const { start = 0 } = req.query;
    const total = await User.find({role: { '$ne': 'admin' }}).countDocuments();
    const users = await User.find({role: { '$ne': 'admin' }}).skip(start);
    res.status(200).json({
      users,
      total,
      next: start + users.length
    });
  } catch (err) {
    res.status(400).json({ status: 0, message: 'Unexpected error' });
  }
});

router.route('/:userId').get(authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    res.status(200).json(user)
  } catch (err) {
    res.status(400).json({ status: 0, message: 'Unexpected error' });
  }
});

router.route('/:userId/schedules').get(authenticateUser, adminProtected, async (req, res) => {
  const { userId } = req.params;
  const { startTime = new Date(), endTime } = req.query;
  const query = {
    '$gte': moment(startTime).startOf('day').toDate(),
    '$lte': endTime ? moment(endTime).endOf('day').toDate() : undefined
  }
  try {
    const schedules = await UserSchedule.find({
      uId: userId,
      startAt: query
    });
    res.status(200).json({ status: 1, schedules })
  } catch (err) {
    res.status(400).json({ status: 0, message: 'Unexpected error' });
  }
})

router.route('/').post(authenticateUser, adminProtected, async (req, res) => {
  const { firstName, lastName, email, inviteCode } = req.body;
  const user = new User();
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.inviteCode = inviteCode;
  user.status = 'created';
  user.role = 'agent';
  try {
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ status: 0, message: 'Unexpected error' });
  }
});

router.route('/:userId').delete(authenticateUser, adminProtected, async (req, res) => {
  const { userId } = req.params;
  try {
    await User.findByIdAndDelete(userId);
    res.status(200).json({ status: 1, message: 'User removed', userId });
  } catch (err) {
    res.status(400).json({ status: 0, message: 'Unexpected error' });
  }
})

router.route('/update-password').put(authenticateUser, async (req, res) => {
  const { user } = res.locals;
  const {password} = req.body;
  if (user.status === 'password-generated') {
    user.status = 'active';
  }
  user.password = password;
  try {
    await user.save();
    res.status(200).json({
      status: 1,
      message: 'Password updated'
    })
  } catch (error) {}
})

export default router;
