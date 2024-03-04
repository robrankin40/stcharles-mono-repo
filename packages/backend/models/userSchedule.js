import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserScheduleSchema = new Schema({
  uId: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: String,
    required: false,
  },
  vin: {
    type: String,
    required: true,
  },
  requiredServiceContent: {
    type: String,
    required: true,
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