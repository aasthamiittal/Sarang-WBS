const mongoose = require('mongoose');

const integrationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['amazon', 'ecommerce', 'courier', 'api'], required: true },
    config: mongoose.Schema.Types.Mixed,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Integration', integrationSchema);
