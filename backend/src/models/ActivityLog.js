const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true },
    entity: String,
    entityId: mongoose.Schema.Types.ObjectId,
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed,
    details: mongoose.Schema.Types.Mixed,
    ip: String,
    correlationId: String,
  },
  { timestamps: true }
);

activityLogSchema.index({ customerId: 1, createdAt: -1 });
activityLogSchema.index({ correlationId: 1 });
module.exports = mongoose.model('ActivityLog', activityLogSchema);
