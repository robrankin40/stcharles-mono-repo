import express from "express";
import moment from "moment";
import { authenticateUser } from "../middlewares/auth.js";
import UserSchedule from "../models/userSchedule.js";

const router = express.Router();

router.route('/').get(authenticateUser, async (req, res) => {
  const { user } = res.locals;
  const { startTime = new Date(), endTime } = req.query;
  const query = {
    '$gte': moment.unix(startTime / 1000).startOf('day').toDate(),
  }
  if (endTime) {
    query['$lte'] = moment.unix(endTime / 1000).endOf('day').toDate()
  }
  try {
    const schedules = await UserSchedule.find({
      uId: user.id,
      startAt: query
    });
    res.status(200).json({ status: 1, schedules })
  } catch (err) {
    res.status(400).json({ status: 0, message: 'Unexpected error' });
  }
})

router.route('/:scheduleId').get(authenticateUser, async (req, res) => {
  const {scheduleId} = req.params;
  try {
    const schedule = await UserSchedule.findById(scheduleId);
    if (schedule) {
      res.status(200).json({ status: 1, schedule });
    } else {
      res.status(404).json({ status: 0, message: 'Schedule not found' });
    }
  } catch (err) {
    res.status(400).json({ status: 0, message: 'Unexpected error' });
  }
});

router.route('/').post(authenticateUser, async (req, res) => {
  const { user } = res.locals;
  const { customerName, customerPhone, vehicleType, vin, requiredServiceContent, startAt, duration } = req.body;
  const schedule = new UserSchedule();
  schedule.uId = user.id;
  schedule.customerName = customerName;
  schedule.customerPhone = customerPhone;
  if (vehicleType) {
    schedule.vehicleType = vehicleType;
  }
  schedule.vin = vin;
  schedule.requiredServiceContent = requiredServiceContent;
  schedule.startAt = startAt;
  schedule.duration = duration;
  try {
    await schedule.save();
    res.status(200).json({ status: 1, schedule });
  } catch (err) {
    res.status(400).json({ status: 0, message: 'Unexpected error' });
  }
});

router.route('/:scheduleId').put(authenticateUser, async (req, res) => {
  const { scheduleId } = req.params;
  const { user } = res.locals;
  try {
    const schedule = await UserSchedule.findById(scheduleId);
    if (!schedule) {
      res.status(404).json({ status: 0, message: 'Schedule not found' });
      return;
    }
    if (schedule.uId !== user.id) {
      res.status(401).json({ status: 0, message: 'Access denied' });
    }
    const { title, body, startAt, duration } = req.body;
    if (title) {
      schedule.title = title;
    }
    if (body) {
      schedule.body = body;
    }
    if (startAt) {
      schedule.startAt = startAt;
    }
    if (duration) {
      schedule.duration = duration;
    }
    await schedule.save();
    res.status(200).json({ status: 1, schedule });
  } catch (err) {
    res.status(400).json({ status: 0, message: 'Unexpected error' });
  }
})

router.route('/:scheduleId').delete(authenticateUser, async (req, res) => {
  const { scheduleId } = req.params;
  const { user } = res.locals;
  try {
    const schedule = await UserSchedule.findById(scheduleId);
    if (!schedule) {
      res.status(404).json({ status: 0, message: 'Schedule not found' });
      return;
    }
    if (schedule.uId !== user.id) {
      res.status(401).json({ status: 0, message: 'Access denied' });
    }
    await UserSchedule.findByIdAndDelete(scheduleId)
    res.status(200).json({ status: 1, message: 'Successfully remove the schedule' })
  } catch (err) {
    res.status(400).json({ status: 0, message: 'Unexpected error' });
  }
})

export default router;
