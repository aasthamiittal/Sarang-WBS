const mongoose = require('mongoose');

const binSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    code: { type: String, required: true },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    zone: String,
    aisle: String,
    rack: String,
    level: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

binSchema.index({ customerId: 1, code: 1, warehouse: 1 }, { unique: true });
module.exports = mongoose.model('Bin', binSchema);
