const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: Number,
  allocatedQty: { type: Number, default: 0 },
});

const orderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    orderNo: { type: String, required: true },
    customerName: String,
    customerEmail: String,
    items: [orderItemSchema],
    status: {
      type: String,
      enum: ['created', 'pending', 'confirmed', 'allocated', 'picking', 'picked', 'packing', 'packed', 'dispatched', 'delivered', 'cancelled', 'backorder'],
      default: 'created',
    },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
    totalAmount: Number,
    notes: String,
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

orderSchema.index({ customerId: 1, orderNo: 1 }, { unique: true });
orderSchema.index({ customerId: 1, status: 1 });
orderSchema.index({ customerId: 1, deletedAt: 1 });

module.exports = mongoose.model('Order', orderSchema);
