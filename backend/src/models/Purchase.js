const mongoose = require('mongoose');

const purchaseItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  unitPrice: Number,
});

const purchaseSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    poNumber: { type: String, required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
    items: [purchaseItemSchema],
    status: { type: String, enum: ['draft', 'ordered', 'received', 'cancelled'], default: 'draft' },
    totalAmount: Number,
    expectedDate: Date,
    notes: String,
  },
  { timestamps: true }
);

purchaseSchema.index({ customerId: 1, poNumber: 1 }, { unique: true });
purchaseSchema.index({ customerId: 1 });
module.exports = mongoose.model('Purchase', purchaseSchema);
