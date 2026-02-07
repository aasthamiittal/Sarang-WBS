const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema(
  {
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

module.exports = mongoose.model('Shipment', shipmentSchema);
