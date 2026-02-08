const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    warehouseIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' }],
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.index({ customerId: 1, email: 1 }, { unique: true });
userSchema.index({ customerId: 1, deletedAt: 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const stored = this.password;
  if (!stored || !candidatePassword) return false;
  const isHash = stored.length >= 60 && /^\$2[aby]?\$/.test(stored);
  if (isHash) return bcrypt.compare(candidatePassword, stored);
  if (stored === candidatePassword) {
    this.password = candidatePassword;
    await this.save();
    return true;
  }
  return false;
};

module.exports = mongoose.model('User', userSchema);
