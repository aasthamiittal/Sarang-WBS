const mongoose = require('mongoose');

const reportJobSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    reportType: {
      type: String,
      enum: [
        'inventory_report',
        'stock_purchase_report',
        'stock_sales_report',
        'order_dispatch_report',
        'customer_report',
        'returns_rto_report',
        'warehouse_performance_report',
      ],
      required: true,
    },
    status: { type: String, enum: ['pending', 'running', 'completed', 'failed'], default: 'pending' },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    filePath: { type: String, default: null },
    result: mongoose.Schema.Types.Mixed,
    errorMessage: { type: String, default: null },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    filters: mongoose.Schema.Types.Mixed,
    completedAt: Date,
  },
  { timestamps: true }
);

reportJobSchema.index({ customerId: 1, createdAt: -1 });
reportJobSchema.index({ customerId: 1, status: 1 });
module.exports = mongoose.model('ReportJob', reportJobSchema);
