const mongoose = require('mongoose');

const returnItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  reason: String,
  qualityStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
});

const returnSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    returnNo: { type: String, required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    shipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment' },
    items: [returnItemSchema],
    status: { type: String, enum: ['received', 'quality_check', 'restocked', 'replaced', 'closed'], default: 'received' },
    rtoTracking: String,
    notes: String,
  },
  { timestamps: true }
);

returnSchema.index({ customerId: 1, returnNo: 1 }, { unique: true });
returnSchema.index({ customerId: 1 });
module.exports = mongoose.model('Return', returnSchema);
