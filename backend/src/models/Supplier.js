const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    code: { type: String, required: true },
    name: { type: String, required: true },
    contactPerson: String,
    email: String,
    phone: String,
    address: String,
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

supplierSchema.index({ customerId: 1, code: 1 }, { unique: true });
supplierSchema.index({ customerId: 1, deletedAt: 1 });
module.exports = mongoose.model('Supplier', supplierSchema);
