const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    code: { type: String, required: true },
    name: { type: String, required: true },
    address: String,
    city: String,
    state: String,
    pincode: String,
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

warehouseSchema.index({ customerId: 1, code: 1 }, { unique: true });
warehouseSchema.index({ customerId: 1, deletedAt: 1 });

module.exports = mongoose.model('Warehouse', warehouseSchema);
