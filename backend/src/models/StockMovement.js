const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    type: { type: String, required: true, enum: ['inward', 'outward', 'adjustment', 'transfer'] },
    quantity: { type: Number, required: true },
    referenceNo: String,
    reason: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

stockMovementSchema.index({ customerId: 1, createdAt: -1 });
module.exports = mongoose.model('StockMovement', stockMovementSchema);
