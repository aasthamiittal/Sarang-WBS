const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: String,
    category: String,
    unit: { type: String, default: 'pcs' },
    reorderLevel: { type: Number, default: 0 },
    costPrice: Number,
    sellingPrice: Number,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
