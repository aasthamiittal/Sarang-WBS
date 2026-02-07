const mongoose = require('mongoose');

const returnItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  reason: String,
  qualityStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
});

const returnSchema = new mongoose.Schema(
  {
    returnNo: { type: String, required: true, unique: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    items: [returnItemSchema],
    status: { type: String, enum: ['received', 'quality_check', 'restocked', 'replaced', 'closed'], default: 'received' },
    rtoTracking: String,
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Return', returnSchema);
