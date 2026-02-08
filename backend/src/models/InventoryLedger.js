/**
 * Immutable inventory ledger (source of truth).
 * Each record is append-only; snapshot (Inventory.quantity) is maintained from these entries.
 */
const mongoose = require('mongoose');

const inventoryLedgerSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    quantityDelta: { type: Number, required: true },
    type: { type: String, required: true, enum: ['inward', 'outward', 'adjustment', 'transfer_in', 'transfer_out'] },
    referenceNo: String,
    reason: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

inventoryLedgerSchema.index({ customerId: 1, product: 1, warehouse: 1, createdAt: 1 });
inventoryLedgerSchema.index({ customerId: 1, createdAt: -1 });
module.exports = mongoose.model('InventoryLedger', inventoryLedgerSchema);
