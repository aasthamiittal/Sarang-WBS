require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Role = require('./models/Role');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/WBS-Sarang';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  const roleCount = await Role.countDocuments();
  if (roleCount === 0) {
    await Role.create({ name: 'Admin', permissions: ['all'], description: 'Full access' });
    console.log('Created Admin role');
  }
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    const adminRole = await Role.findOne({ name: 'Admin' });
    await User.create({
      name: 'Admin',
      email: 'admin@wbs-sarang.com',
      password: 'admin123',
      role: adminRole?._id,
      isActive: true,
    });
    console.log('Created admin user: admin@wbs-sarang.com / admin123');
  } else {
    console.log('Users already exist. Skip seed.');
  }
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
