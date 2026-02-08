const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    courier: String,
    trackingNo: String,
    labelUrl: String,
    deliveryStatus: { type: String, enum: ['pending', 'picked', 'in_transit', 'delivered', 'failed'], default: 'pending' },
    shippedAt: Date,
    deliveredAt: Date,
  },
  { timestamps: true }
);

shipmentSchema.index({ customerId: 1, order: 1 });
shipmentSchema.index({ customerId: 1, trackingNo: 1 });
module.exports = mongoose.model('Shipment', shipmentSchema);
