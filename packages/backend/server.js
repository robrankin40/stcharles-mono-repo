import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import userScheduleRouter from './routes/userSchedule.js';
import User from './models/user.js';
dotenv.config();

const app = express();

app.use(express.json());

const MONGO_CONNECTION_URI = process.env.MONGODB_CONNECTION;
const port = process.env.PORT || 3000;
const adminFirstName = process.env.ADMIN_USER_FIRST_NAME;
const adminLastName = process.env.ADMIN_USER_LAST_NAME;
const adminEmail = process.env.ADMIN_USER_EMAIL;
const adminPassword = process.env.ADMIN_USER_PASSWORD;

app.get('/', (req, res) => {
  res.send('<h1>Hello, Express.js Server!</h1>');
});

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/schedule', userScheduleRouter);


// Specify the port to listen on
export const startServer =  async () => {
  try {
    await mongoose.connect(MONGO_CONNECTION_URI);
    console.log('MongoDB connection success!');
    const existingAdmin = await User.findOne({ role: 'admin' })
    if (adminFirstName && adminLastName && adminEmail && adminPassword) {
      const newAdminExists = await User.findOne({ role: 'admin', email: adminEmail })
      if (!newAdminExists) {
        const newAdmin = new User();
        newAdmin.firstName = adminFirstName;
        newAdmin.lastName = adminLastName;
        newAdmin.email = adminEmail;
        newAdmin.password = adminPassword;
        newAdmin.status = 'active';
        newAdmin.inviteCode = 'hello';
        newAdmin.role = 'admin';
        await newAdmin.save();
        console.log('Admin User Created\n');
      } else {
        console.log('Admin Already Exists\n');
      }
    } else if (!existingAdmin) {
      console.log("You don't have admin user set. Please add admin information to environment file and try again.\n");
      return;
    } else {
      console.log('Admin Already Exists.\n');
    }
    app.listen(port, () => {
      console.log(`Server is running on port ${port}\n`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
