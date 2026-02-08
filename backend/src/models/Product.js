const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    category: String,
    unit: { type: String, default: 'pcs' },
    reorderLevel: { type: Number, default: 0 },
    costPrice: Number,
    sellingPrice: Number,
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

productSchema.index({ customerId: 1, sku: 1 }, { unique: true });
productSchema.index({ customerId: 1, deletedAt: 1 });

module.exports = mongoose.model('Product', productSchema);
