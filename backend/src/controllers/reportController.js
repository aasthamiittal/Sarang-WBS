const Inventory = require('../models/Inventory');
const StockMovement = require('../models/StockMovement');
const Order = require('../models/Order');
const Return = require('../models/Return');
const Purchase = require('../models/Purchase');
const ReportJob = require('../models/ReportJob');

const tenantFilter = (req) => ({ customerId: req.tenantId });

const PAGE_DEFAULT = 1;
const LIMIT_DEFAULT = 50;
const LIMIT_MAX = 500;

function paginate(req) {
  const page = Math.max(1, parseInt(req.query.page, 10) || PAGE_DEFAULT);
  const limit = Math.min(LIMIT_MAX, Math.max(1, parseInt(req.query.limit, 10) || LIMIT_DEFAULT));
  return { page, limit, skip: (page - 1) * limit };
}

exports.inventoryReport = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req);
    const filter = tenantFilter(req);
    const [data, total] = await Promise.all([
      Inventory.find(filter)
        .populate('product', 'sku name category')
        .populate('warehouse', 'code name')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Inventory.countDocuments(filter),
    ]);
    res.json({ success: true, data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

exports.stockPurchaseReport = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req);
    const filter = { ...tenantFilter(req), type: 'inward' };
    const [data, total] = await Promise.all([
      StockMovement.find(filter)
        .populate('product', 'sku name')
        .populate('warehouse', 'code name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      StockMovement.countDocuments(filter),
    ]);
    res.json({ success: true, data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

exports.stockSalesReport = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req);
    const filter = { ...tenantFilter(req), type: 'outward' };
    const [data, total] = await Promise.all([
      StockMovement.find(filter)
        .populate('product', 'sku name')
        .populate('warehouse', 'code name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      StockMovement.countDocuments(filter),
    ]);
    res.json({ success: true, data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

exports.orderDispatchReport = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req);
    const filter = { ...tenantFilter(req), deletedAt: null, status: { $in: ['dispatched', 'delivered'] } };
    const [data, total] = await Promise.all([
      Order.find(filter).populate('warehouse', 'code name').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(filter),
    ]);
    res.json({ success: true, data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

exports.customerReport = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req);
    const [result, totalResult] = await Promise.all([
      Order.aggregate([
        { $match: { customerId: req.tenantId, deletedAt: null } },
        { $group: { _id: '$customerEmail', customerName: { $first: '$customerName' }, orderCount: { $sum: 1 }, totalAmount: { $sum: '$totalAmount' } } },
        { $sort: { orderCount: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]),
      Order.aggregate([
        { $match: { customerId: req.tenantId, deletedAt: null } },
        { $group: { _id: '$customerEmail' } },
        { $count: 'total' },
      ]),
    ]);
    const total = totalResult[0]?.total ?? 0;
    res.json({ success: true, data: result, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

exports.returnsRtoReport = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req);
    const filter = tenantFilter(req);
    const [data, total] = await Promise.all([
      Return.find(filter)
        .populate('order')
        .populate('items.product', 'sku name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Return.countDocuments(filter),
    ]);
    res.json({ success: true, data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

exports.warehousePerformanceReport = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req);
    const [data, totalResult] = await Promise.all([
      Order.aggregate([
        { $match: { customerId: req.tenantId, deletedAt: null, status: { $in: ['dispatched', 'delivered'] } } },
        { $group: { _id: '$warehouse', count: { $sum: 1 }, totalAmount: { $sum: '$totalAmount' } } },
        { $lookup: { from: 'warehouses', localField: '_id', foreignField: '_id', as: 'warehouse' } },
        { $unwind: '$warehouse' },
        { $skip: skip },
        { $limit: limit },
      ]),
      Order.aggregate([
        { $match: { customerId: req.tenantId, deletedAt: null, status: { $in: ['dispatched', 'delivered'] } } },
        { $group: { _id: '$warehouse' } },
        { $count: 'total' },
      ]),
    ]);
    const total = totalResult[0]?.total ?? 0;
    res.json({ success: true, data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

/** Report type -> permission module for download check */
const REPORT_DOWNLOAD_MODULE = {
  inventory_report: 'inventory_report',
  stock_purchase_report: 'stock_report',
  stock_sales_report: 'stock_report',
  order_dispatch_report: 'order_report',
  customer_report: 'order_report',
  returns_rto_report: 'returns_report',
  warehouse_performance_report: 'order_report',
};

async function runReportByType(reportType, customerId) {
  const filter = { customerId };
  switch (reportType) {
    case 'inventory_report': {
      const data = await Inventory.find(filter)
        .populate('product', 'sku name category')
        .populate('warehouse', 'code name')
        .lean();
      return data;
    }
    case 'stock_purchase_report': {
      return StockMovement.find({ ...filter, type: 'inward' })
        .populate('product', 'sku name')
        .populate('warehouse', 'code name')
        .sort({ createdAt: -1 })
        .limit(LIMIT_MAX)
        .lean();
    }
    case 'stock_sales_report': {
      return StockMovement.find({ ...filter, type: 'outward' })
        .populate('product', 'sku name')
        .populate('warehouse', 'code name')
        .sort({ createdAt: -1 })
        .limit(LIMIT_MAX)
        .lean();
    }
    case 'order_dispatch_report': {
      return Order.find({ ...filter, deletedAt: null, status: { $in: ['dispatched', 'delivered'] } })
        .populate('warehouse', 'code name')
        .sort({ createdAt: -1 })
        .limit(LIMIT_MAX)
        .lean();
    }
    case 'customer_report': {
      return Order.aggregate([
        { $match: { customerId, deletedAt: null } },
        { $group: { _id: '$customerEmail', customerName: { $first: '$customerName' }, orderCount: { $sum: 1 }, totalAmount: { $sum: '$totalAmount' } } },
        { $sort: { orderCount: -1 } },
        { $limit: LIMIT_MAX },
      ]);
    }
    case 'returns_rto_report': {
      return Return.find(filter).populate('order').populate('items.product', 'sku name').sort({ createdAt: -1 }).limit(LIMIT_MAX).lean();
    }
    case 'warehouse_performance_report': {
      return Order.aggregate([
        { $match: { customerId, deletedAt: null, status: { $in: ['dispatched', 'delivered'] } } },
        { $group: { _id: '$warehouse', count: { $sum: 1 }, totalAmount: { $sum: '$totalAmount' } } },
        { $lookup: { from: 'warehouses', localField: '_id', foreignField: '_id', as: 'warehouse' } },
        { $unwind: '$warehouse' },
        { $limit: LIMIT_MAX },
      ]);
    }
    default:
      throw new Error(`Unknown report type: ${reportType}`);
  }
}

exports.requestReportJob = async (req, res, next) => {
  try {
    const { reportType, filters } = req.body || {};
    if (!reportType || !ReportJob.schema.path('reportType').enumValues.includes(reportType)) {
      return res.status(400).json({ success: false, message: 'Valid reportType required.' });
    }
    const customerId = req.tenantId;
    const userId = req.user?.userId || req.user?.id;
    const job = await ReportJob.create({
      customerId,
      reportType,
      filters: filters || {},
      status: 'pending',
      requestedBy: userId,
    });
    setImmediate(async () => {
      try {
        await ReportJob.updateOne({ _id: job._id }, { status: 'running', progress: 10 });
        const data = await runReportByType(reportType, job.customerId);
        await ReportJob.updateOne(
          { _id: job._id },
          { status: 'completed', progress: 100, result: data, filePath: `job:${job._id}`, completedAt: new Date() }
        );
      } catch (err) {
        await ReportJob.updateOne(
          { _id: job._id },
          { status: 'failed', errorMessage: err.message || String(err), completedAt: new Date() }
        );
      }
    });
    res.status(202).json({ success: true, data: { jobId: job._id, status: 'pending', message: 'Report job queued.' } });
  } catch (err) {
    next(err);
  }
};

exports.getReportJobs = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req);
    const filter = tenantFilter(req);
    const [data, total] = await Promise.all([
      ReportJob.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ReportJob.countDocuments(filter),
    ]);
    res.json({ success: true, data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

exports.getReportJob = async (req, res, next) => {
  try {
    const job = await ReportJob.findOne({ _id: req.params.id, ...tenantFilter(req) }).lean();
    if (!job) return res.status(404).json({ success: false, message: 'Report job not found.' });
    const { result, ...rest } = job;
    res.json({ success: true, data: rest });
  } catch (err) {
    next(err);
  }
};

exports.downloadReportJob = async (req, res, next) => {
  try {
    const job = await ReportJob.findOne({ _id: req.params.id, ...tenantFilter(req) });
    if (!job) return res.status(404).json({ success: false, message: 'Report job not found.' });
    const downloadModule = REPORT_DOWNLOAD_MODULE[job.reportType];
    if (!downloadModule) return res.status(400).json({ success: false, message: 'Unknown report type.' });
    const canDownload = req.user?.permissions?.[downloadModule]?.download === true;
    if (!canDownload) return res.status(403).json({ success: false, message: 'Download not allowed for this report.' });
    if (job.status !== 'completed' || job.result == null) {
      return res.status(400).json({ success: false, message: 'Report not ready for download.', status: job.status });
    }
    res.json({ success: true, data: job.result });
  } catch (err) {
    next(err);
  }
};
