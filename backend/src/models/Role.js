const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    permissions: { type: mongoose.Schema.Types.Mixed, default: () => ({}) },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    isActive: { type: Boolean, default: true },
    description: String,
  },
  { timestamps: true }
);

roleSchema.index({ name: 1, customerId: 1 }, { unique: true });

module.exports = mongoose.model('Role', roleSchema);
