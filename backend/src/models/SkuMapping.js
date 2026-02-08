/**
 * External SKU (e.g. from marketplace) to internal Product mapping per integration.
 */
const mongoose = require('mongoose');

const skuMappingSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    integration: { type: mongoose.Schema.Types.ObjectId, ref: 'Integration', required: true },
    externalSku: { type: String, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  },
  { timestamps: true }
);

skuMappingSchema.index({ customerId: 1, integration: 1, externalSku: 1 }, { unique: true });
skuMappingSchema.index({ customerId: 1, integration: 1 });
module.exports = mongoose.model('SkuMapping', skuMappingSchema);
