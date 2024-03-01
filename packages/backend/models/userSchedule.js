import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserScheduleSchema = new Schema({
  uId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: false,
  },
  startAt: {
    type: Date,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  }
}, {
  timestamp: true
});

const UserSchedule = mongoose.model('UserSchedule', UserScheduleSchema)

export default UserSchedule