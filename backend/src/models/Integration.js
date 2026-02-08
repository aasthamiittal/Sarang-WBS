const mongoose = require('mongoose');

const integrationSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['amazon', 'ecommerce', 'courier', 'api'], required: true },
    config: mongoose.Schema.Types.Mixed,
    isActive: { type: Boolean, default: true },
    lastSyncAt: Date,
    lastError: String,
    retryCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

integrationSchema.index({ customerId: 1, type: 1 });
module.exports = mongoose.model('Integration', integrationSchema);
