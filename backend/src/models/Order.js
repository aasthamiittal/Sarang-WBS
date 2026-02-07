const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: Number,
});

const orderSchema = new mongoose.Schema(
  {
    orderNo: { type: String, required: true, unique: true },
    customerName: String,
    customerEmail: String,
    items: [orderItemSchema],
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'picking', 'packing', 'dispatched', 'delivered', 'cancelled', 'backorder'],
      default: 'pending',
    },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
    totalAmount: Number,
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
