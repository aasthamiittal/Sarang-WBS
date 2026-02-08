const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    bin: { type: mongoose.Schema.Types.ObjectId, ref: 'Bin' },
    quantity: { type: Number, required: true, default: 0 },
    reservedQuantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

inventorySchema.index({ customerId: 1, product: 1, warehouse: 1 }, { unique: true });
inventorySchema.index({ customerId: 1, warehouse: 1 });
module.exports = mongoose.model('Inventory', inventorySchema);
