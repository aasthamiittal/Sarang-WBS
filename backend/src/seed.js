require('dotenv').config();
const mongoose = require('mongoose');
const Customer = require('./models/Customer');
const User = require('./models/User');
const Role = require('./models/Role');
const { getFullPermissions } = require('./config/permissions');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/WBS-Sarang';

const DEFAULT_CUSTOMER_CODE = 'DEFAULT';
const ADMIN_EMAIL = 'admin@wbs-sarang.com';
const ADMIN_PASSWORD = 'admin@123';

async function seed() {
  await mongoose.connect(MONGODB_URI);

  let customer = await Customer.findOne({ code: DEFAULT_CUSTOMER_CODE });
  if (!customer) {
    customer = await Customer.create({
      code: DEFAULT_CUSTOMER_CODE,
      name: 'Default Tenant',
      isActive: true,
    });
    console.log('Created default customer:', customer.code);
  }

  let adminRole = await Role.findOne({ name: 'Admin', customerId: customer._id });
  if (!adminRole) {
    adminRole = await Role.create({
      name: 'Admin',
      customerId: customer._id,
      permissions: getFullPermissions(),
      description: 'Full access',
      isActive: true,
    });
    console.log('Created Admin role with full permissions');
  } else if (Array.isArray(adminRole.permissions) || !adminRole.permissions || typeof adminRole.permissions !== 'object') {
    await Role.findByIdAndUpdate(adminRole._id, { permissions: getFullPermissions() });
    console.log('Migrated Admin role to new permissions structure');
  }

  let adminUser = await User.findOne({ email: ADMIN_EMAIL }).select('+password');
  if (!adminUser) {
    await User.create({
      name: 'Admin',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: adminRole._id,
      customerId: customer._id,
      isActive: true,
    });
    console.log('Created admin user:', ADMIN_EMAIL, ' / password:', ADMIN_PASSWORD);
  } else {
    if (!adminUser.customerId) {
      adminUser.customerId = customer._id;
      await adminUser.save();
      console.log('Assigned default customer to existing admin');
    }
    adminUser.password = ADMIN_PASSWORD;
    adminUser.markModified('password');
    await adminUser.save();
    console.log('Updated admin password for', ADMIN_EMAIL, '-> login with password:', ADMIN_PASSWORD);
  }

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
